/* 3D hero scene — WebGL via three.js, themed objects, mouse parallax */
(function () {
  var canvas = document.getElementById('scene3d');
  if (!canvas || typeof THREE === 'undefined') return;
  var renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); }
  catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0507, 0.06);
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  scene.add(new THREE.AmbientLight(0x8899bb, 0.5));
  var key = new THREE.PointLight(0xE84545, 1.8, 60); key.position.set(6, 6, 8); scene.add(key);
  var rim = new THREE.PointLight(0xff8e53, 1.0, 60); rim.position.set(-8, -3, 6); scene.add(rim);
  var top = new THREE.DirectionalLight(0xffffff, .5); top.position.set(0, 10, 5); scene.add(top);

  var group = new THREE.Group();
  scene.add(group);
  var floats = [];

  function reg(mesh, amp, sp, rx, ry) {
    mesh.userData = { y0: mesh.position.y, amp: amp, sp: sp, ph: Math.random() * Math.PI * 2, rx: rx || 0, ry: ry || 0 };
    group.add(mesh); floats.push(mesh);
    return mesh;
  }

  
  var iron = new THREE.MeshStandardMaterial({ color: 0x2b2d33, metalness: 0.9, roughness: 0.35 });
  var redGlow = new THREE.MeshStandardMaterial({ color: 0xE84545, metalness: 0.6, roughness: 0.3, emissive: 0x5a1010 });
  function dumbbell(scale) {
    var g = new THREE.Group();
    var bar = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.5, 20), iron);
    bar.rotation.z = Math.PI / 2; g.add(bar);
    [[-1.05],[1.05]].forEach(function (sx) {
      var plate = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.22, 32), iron);
      plate.rotation.z = Math.PI / 2; plate.position.x = sx[0];
      g.add(plate);
      var stripe = new THREE.Mesh(new THREE.TorusGeometry(0.53, 0.045, 12, 40), redGlow);
      stripe.position.x = sx[0]; stripe.rotation.y = Math.PI / 2;
      g.add(stripe);
    });
    g.scale.setScalar(scale);
    return g;
  }
  [[-5.8,1.8,-2.5,1.1,.6],[6.2,2.6,-3,1.4,.5],[-2.6,-3.6,-2,.9,.7],[3.4,-4.0,-3.5,1.2,.55]].forEach(function (s) {
    var d = dumbbell(s[3]);
    d.position.set(s[0], s[1], s[2]);
    d.rotation.set(.2 + Math.random()*.6, Math.random()*3, .15);
    reg(d, s[4], .6 + Math.random()*.4, 0.002, 0.006);
  });
  // kettlebell
  var kb = new THREE.Group();
  var bell = new THREE.Mesh(new THREE.SphereGeometry(0.62, 24, 20), iron);
  kb.add(bell);
  var handle = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.07, 12, 40, Math.PI), iron);
  handle.position.y = 0.55; kb.add(handle);
  kb.position.set(7.6, -2.2, -1.5); kb.scale.setScalar(1.15);
  reg(kb, 0.5, .8, 0.003, 0.007);
  // weight plates stack
  var stack = new THREE.Group();
  for (var i = 0; i < 3; i++) {
    var pl = new THREE.Mesh(new THREE.CylinderGeometry(0.55 - i*0.09, 0.55 - i*0.09, 0.16, 32), iron);
    pl.position.y = i * 0.18; stack.add(pl);
  }
  stack.position.set(-7.0, -3.0, -3); stack.rotation.z = 0.1;
  reg(stack, 0.35, .5, 0.001, 0.002);


  // dust particles
  var pGeo = new THREE.BufferGeometry();
  var pArr = new Float32Array(160 * 3);
  for (var i = 0; i < 160; i++) {
    pArr[i * 3] = (Math.random() - .5) * 24;
    pArr[i * 3 + 1] = (Math.random() - .5) * 14;
    pArr[i * 3 + 2] = (Math.random() - .5) * 12;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3));
  var pts = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xff8e53, size: 0.05, transparent: true, opacity: 0.55 }));
  group.add(pts);


  /* ---- v3: glow bloom sprites (procedural, additive) ---- */
  var gc = document.createElement('canvas'); gc.width = gc.height = 128;
  var gctx = gc.getContext('2d');
  var ggr = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  ggr.addColorStop(0, 'rgba(255,255,255,1)');
  ggr.addColorStop(.3, 'rgba(255,255,255,.45)');
  ggr.addColorStop(1, 'rgba(255,255,255,0)');
  gctx.fillStyle = ggr; gctx.fillRect(0, 0, 128, 128);
  var glowTex = new THREE.CanvasTexture(gc);
  function mkGlow(color, x, y, z, s, op) {
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: color, transparent: true, opacity: op,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    sp.position.set(x, y, z); sp.scale.setScalar(s);
    scene.add(sp);
    return sp;
  }
  mkGlow(0xe84545, -6, 3.5, -5, 8, 0.5);
  mkGlow(0xff8e53, 6.5, -3, -4, 7, 0.42);
  mkGlow(0xff8e53, 0, -4.5, -7, 9, 0.3);

  /* ---- v3: deep nebula starfield ---- */
  var nGeo = new THREE.BufferGeometry();
  var nArr = new Float32Array(700 * 3);
  for (var ni = 0; ni < 700; ni++) {
    var r = 9 + Math.random() * 7;
    var th = Math.random() * Math.PI * 2;
    var ph = Math.acos(2 * Math.random() - 1);
    nArr[ni * 3] = r * Math.sin(ph) * Math.cos(th);
    nArr[ni * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.6;
    nArr[ni * 3 + 2] = -6 - r * Math.cos(ph) * 0.4;
  }
  nGeo.setAttribute('position', new THREE.BufferAttribute(nArr, 3));
  var nebula = new THREE.Points(nGeo, new THREE.PointsMaterial({
    color: 0xff8e53, size: 0.045, transparent: true, opacity: 0.5, depthWrite: false
  }));
  scene.add(nebula);

  /* ---- v3: scroll-driven camera dolly ---- */
  window.addEventListener('scroll', function () {
    var sf = Math.min(window.scrollY / window.innerHeight, 1.2);
    camera.position.z = 11 + sf * 4;
  }, { passive: true });

  var tx = 0, ty = 0;
  window.addEventListener('pointermove', function (e) {
    tx = (e.clientX / window.innerWidth - .5) * 2;
    ty = (e.clientY / window.innerHeight - .5) * 2;
  }, { passive: true });

  function resize() {
    var p = canvas.parentElement;
    var w = p.clientWidth, h = p.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  var visible = true;
  document.addEventListener('visibilitychange', function () { visible = !document.hidden; });

  var clock = new THREE.Clock();
  (function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    var t = clock.getElapsedTime();
    for (var i = 0; i < floats.length; i++) {
      var m = floats[i], u = m.userData;
      m.position.y = u.y0 + Math.sin(t * u.sp + u.ph) * u.amp;
      m.rotation.x = m.rotation.x + u.rx;
      m.rotation.y = m.rotation.y + u.ry;
    }
    pts.rotation.y = t * 0.03;
    nebula.rotation.y = -t * 0.02;
    group.rotation.y += (tx * 0.30 - group.rotation.y) * 0.045;
    group.rotation.x += (ty * 0.14 - group.rotation.x) * 0.045;
    camera.position.x = tx * 0.9; camera.position.y = -ty * 0.55;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  })();
})();
