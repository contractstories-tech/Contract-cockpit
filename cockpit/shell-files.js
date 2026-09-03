(function attachContractCockpitShell(root){
  root.ContractCockpitShellFiles=Object.freeze({
    cachePrefix:'contract-cockpit-pwa-',
    cacheName:'contract-cockpit-pwa-v7.6',
    required:Object.freeze([
      'index.html',
      'styles.css',
      'analysis-core.js',
      'review-core.js',
      'workflow-core.js',
      'playbook-core.js',
      'app.js',
      'shell-files.js',
      'pwa.js'
    ]),
    optional:Object.freeze([
      'manifest.webmanifest',
      'icons/icon-192.png',
      'icons/icon-512.png',
      'icons/apple-touch-icon.png'
    ])
  });
})(typeof globalThis!=='undefined'?globalThis:self);
