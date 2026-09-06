(() => {
  const VAPID_PUBLIC_KEY =
    'BHcnRsBaWMNkfsqebW6IMJQoRjAJx-7th6agJBXB_M34rGuxe4ueEkGapDjWVyjyPLOSW1X0trZ0HqZpR5qFtag';

  const button = document.getElementById('pushBtn');
  const pushStatus = document.getElementById('pushStatus');

  if (!button || !pushStatus) return;

  function setPushStatus(text = '', type = '') {
    pushStatus.textContent = text;
    pushStatus.className =
      'status' + (type ? ' ' + type : '');
  }

  function urlBase64ToUint8Array(base64String) {
    const padding =
      '='.repeat((4 - (base64String.length % 4)) % 4);

    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = atob(base64);

    return Uint8Array.from(
      [...rawData].map(
        (char) => char.charCodeAt(0)
      )
    );
  }

  function isIos() {
    return /iphone|ipad|ipod/i.test(
      navigator.userAgent
    );
  }

  function isStandalone() {
    return window
      .matchMedia('(display-mode: standalone)')
      .matches ||
      window.navigator.standalone === true;
  }

  async function getCurrentUser() {
    if (!window.client) return null;

    const { data, error } =
      await window.client.auth.getUser();

    if (error) throw error;

    return data?.user || null;
  }

  async function ensureSubscription() {
    if (
      !('serviceWorker' in navigator) ||
      !('PushManager' in window)
    ) {
      throw new Error('unsupported');
    }

    if (isIos() && !isStandalone()) {
      throw new Error('ios-not-standalone');
    }

    const user = await getCurrentUser();

    if (!user) {
      throw new Error('not-authenticated');
    }

    const permission =
      await Notification.requestPermission();

    if (permission !== 'granted') {
      throw new Error('permission-denied');
    }

    const registration =
      await navigator.serviceWorker.register('/sw.js');

    await navigator.serviceWorker.ready;

    let subscription =
      await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription =
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            urlBase64ToUint8Array(
              VAPID_PUBLIC_KEY
            )
        });
    }

    const json = subscription.toJSON();

    const endpoint = json.endpoint;
    const p256dh = json.keys?.p256dh;
    const auth = json.keys?.auth;

    if (!endpoint || !p256dh || !auth) {
      throw new Error('invalid-subscription');
    }

    const {
      data: existing,
      error: selectError
    } = await window.client
      .from('push_subscriptions')
      .select('id')
      .eq('endpoint', endpoint)
      .maybeSingle();

    if (selectError) throw selectError;

    if (!existing) {
      const { error: insertError } =
        await window.client
          .from('push_subscriptions')
          .insert({
            user_id: user.id,
            endpoint,
            p256dh,
            auth
          });

      if (insertError) throw insertError;
    }

    return subscription;
  }

  button.addEventListener(
    'click',
    async () => {
      button.disabled = true;

      setPushStatus(
        'Подключаем уведомления…'
      );

      try {
        await ensureSubscription();

        button.textContent =
          '🔔 Уведомления включены';

        setPushStatus(
          'Готово ✅ Теперь приложение может получать push-уведомления.',
          'ok'
        );

      } catch (error) {
        console.error(
          'Push setup error:',
          error
        );

        if (
          error.message ===
          'ios-not-standalone'
        ) {
          setPushStatus(
            'На iPhone открой именно установленное приложение с экрана Домой и нажми кнопку ещё раз.',
            'err'
          );

        } else if (
          error.message ===
          'not-authenticated'
        ) {
          setPushStatus(
            'Сначала войди в аккаунт.',
            'err'
          );

        } else if (
          error.message ===
          'permission-denied'
        ) {
          setPushStatus(
            'Разрешение на уведомления не получено.',
            'err'
          );

        } else if (
          error.message ===
          'unsupported'
        ) {
          setPushStatus(
            'На этом устройстве push-уведомления не поддерживаются.',
            'err'
          );

        } else {
          setPushStatus(
            'Не удалось включить уведомления. Попробуй ещё раз.',
            'err'
          );
        }

      } finally {
        button.disabled = false;
      }
    }
  );

  (async () => {
    try {
      if (
        !('serviceWorker' in navigator) ||
        !('PushManager' in window)
      ) {
        return;
      }

      const registration =
        await navigator.serviceWorker
          .getRegistration('/sw.js');

      if (!registration) return;

      const subscription =
        await registration.pushManager
          .getSubscription();

      if (
        subscription &&
        Notification.permission === 'granted'
      ) {
        button.textContent =
          '🔔 Уведомления включены';

        setPushStatus(
          'Push-уведомления подключены.',
          'ok'
        );
      }

    } catch (error) {
      console.error(
        'Push state check error:',
        error
      );
    }
  })();
})();
