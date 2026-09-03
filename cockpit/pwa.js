(function () {
  'use strict';

  const shell=globalThis.ContractCockpitShellFiles;
  const CACHE_NAME = shell.cacheName;
  const REQUIRED_SHELL_FILES = shell.required;
  const statusCard = document.getElementById('pwaStatusCard');
  const statusTitle = document.getElementById('pwaStatusTitle');
  const statusText = document.getElementById('pwaStatusText');
  const installButton = document.getElementById('pwaInstallBtn');
  const dismissButton = document.getElementById('pwaDismissBtn');
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  let installPrompt = null;
  let waitingWorker = null;
  let reloadingForUpdate = false;

  function setStatus(title, message, mode) {
    if (!statusCard) return;
    statusCard.classList.toggle('ready', mode === 'ready');
    statusCard.classList.toggle('offline', mode === 'offline');
    if (statusTitle) statusTitle.textContent = title;
    if (statusText) statusText.textContent = message;
  }

  async function verifyOfflineShell() {
    if (!('caches' in window)) return false;
    const cache = await caches.open(CACHE_NAME);
    const matches = await Promise.all(REQUIRED_SHELL_FILES.map(path => cache.match(new URL(path, location.href).href)));
    return matches.every(Boolean);
  }

  function showInstallGuidance(offlineReady) {
    if (isStandalone || !statusCard) return;
    statusCard.classList.remove('hidden');
    dismissButton?.classList.remove('hidden');
    if (waitingWorker) {
      installButton?.classList.remove('hidden');
      if (installButton) installButton.textContent = 'Update now';
      setStatus('Update available', 'Save any active edits, then update to the latest Contract Cockpit.', 'ready');
    } else if (installPrompt) {
      installButton?.classList.remove('hidden');
      if (installButton) installButton.textContent = 'Install app';
      setStatus('Install Contract Cockpit', offlineReady ? 'The verified offline shell is ready. Install it for one-tap access.' : 'Install it after offline setup finishes.', offlineReady ? 'ready' : 'offline');
    } else if (isIos) {
      installButton?.classList.add('hidden');
      setStatus('Install on iPhone or iPad', offlineReady ? 'Offline shell verified. In Safari, tap Share, then Add to Home Screen.' : 'Keep this page open online until offline setup is verified, then use Share → Add to Home Screen.', offlineReady ? 'ready' : 'offline');
    } else {
      installButton?.classList.add('hidden');
      setStatus(offlineReady ? 'Offline access verified' : 'Offline setup incomplete', offlineReady ? 'The complete review shell is cached on this device.' : 'Reload while connected to complete the required offline files.', offlineReady ? 'ready' : 'offline');
    }
  }

  function offerUpdate(worker) {
    waitingWorker = worker;
    verifyOfflineShell().then(showInstallGuidance).catch(() => showInstallGuidance(false));
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    verifyOfflineShell().then(showInstallGuidance).catch(() => showInstallGuidance(false));
  });

  installButton?.addEventListener('click', async () => {
    if (waitingWorker) {
      const beforeUpdate=await globalThis.ContractCockpitBeforeUpdate?.();
      if(beforeUpdate?.ok===false){
        const proceed=window.confirm(`${beforeUpdate.message}\n\nUpdate without saving a local autosave?`);
        if(!proceed)return;
      }
      waitingWorker.postMessage('SKIP_WAITING');
      setStatus('Applying update…', 'The app will reload once the new offline shell is active.', 'ready');
      return;
    }
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installButton.classList.add('hidden');
  });

  dismissButton?.addEventListener('click', () => statusCard?.classList.add('hidden'));
  window.addEventListener('appinstalled', () => statusCard?.classList.add('hidden'));
  window.addEventListener('offline', () => setStatus('Working offline', 'The verified shell and locally saved review remain available on this device.', 'offline'));
  window.addEventListener('online', () => verifyOfflineShell().then(showInstallGuidance).catch(() => showInstallGuidance(false)));

  if (!('serviceWorker' in navigator)) {
    setStatus('Offline installation unavailable', 'Use a current Safari, Chrome, or Edge browser.', 'offline');
    return;
  }

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloadingForUpdate) return;
    reloadingForUpdate = true;
    location.reload();
  });

  navigator.serviceWorker.register('./service-worker.js', { scope: './' })
    .then(registration => {
      if (registration.waiting && navigator.serviceWorker.controller) offerUpdate(registration.waiting);
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) offerUpdate(worker);
        });
      });
      return navigator.serviceWorker.ready;
    })
    .then(async () => {
      const offlineReady = await verifyOfflineShell();
      if (isStandalone && offlineReady && !waitingWorker) statusCard?.classList.add('hidden');
      else showInstallGuidance(offlineReady);
    })
    .catch(() => setStatus('Offline setup needs another try', 'Reload this page while connected to the internet.', 'offline'));
})();
