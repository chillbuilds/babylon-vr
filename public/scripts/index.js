const videoUrl = 'https://flamingoflapjack.com/assets/videos/delta%20halo%203-08.mp4';

window.addEventListener('DOMContentLoaded', () => {

    BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-vr').then((supported) => {
        if (supported) {
            console.log("✅ XR headset is supported on this device")
            // $('#babylonCanvas').attr('style', 'display: inline-block;')
        } else {
            console.log("🚫 XR headset NOT supported")
            $('#message').text('get a dang headset')
        }
    })


  const canvas = document.getElementById('babylonCanvas')
  const engine = new BABYLON.Engine(canvas, true)
  let scene;

var createScene = function () {
  scene = new BABYLON.Scene(engine)

  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, -3), scene)
//   camera.setTarget(new BABYLON.Vector3(0, 0, 0))
  camera.attachControl(canvas, true)

  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene)
  light.intensity = 0.7

//   const beforeMeshes = scene.meshes.slice();

//   BABYLON.SceneLoader.AppendAsync('/assets/models/', 'train.glb', scene).then(() => {
//     const newMeshes = scene.meshes.filter(m => !beforeMeshes.includes(m))

//     // Try to find the root node
//     const root = newMeshes.find(m => m.name === "__root__" || !m.parent)

//     if (root) {
//       root.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01)
//     } else {
//       console.log("Could not find root mesh to scale")
//     }
//   })

  const screen = BABYLON.MeshBuilder.CreatePlane("videoScreen", {
    width: 8,
    height: 5 // 16:9 ratio
    }, scene)

  screen.position = new BABYLON.Vector3(0, 1, 10)
  const screenMaterial = new BABYLON.StandardMaterial("screenMat", scene)
  
//   const videoTexture = new BABYLON.VideoTexture("video", videoUrl, scene, true, true, BABYLON.VideoTexture.TRILINEAR_SAMPLINGMODE, {
  const videoTexture = new BABYLON.VideoTexture("video", '../assets/videos/pinion.mp4', scene, true, true, BABYLON.VideoTexture.TRILINEAR_SAMPLINGMODE, {
    autoUpdateTexture: true,
    poster: "", // optional preview image
    loop: true,
    autoplay: false
  })

  videoTexture.video.autoplay = false
  videoTexture.video.muted = false
  videoTexture.video.pause()

  videoTexture.uScale = 1;
  videoTexture.vScale = -1;

  screenMaterial.emissiveColor = new BABYLON.Color3(-0.36, -0.36, -0.36)

  screenMaterial.emissiveTexture = videoTexture;
  screen.material = screenMaterial;

  return scene
}


  scene = createScene()

scene.createDefaultXRExperienceAsync({disableTeleportation: true}).then((xr) => {
  const xrCamera = xr.baseExperience.camera
  const speed = 0.05
  let inputAxes = { x: 0, y: 0 }

  // Listen for controller input
  xr.input.onControllerAddedObservable.add((controller) => {
    controller.onMotionControllerInitObservable.add((motionController) => {
      const thumbstick = motionController.getComponent("xr-standard-thumbstick")
      if (thumbstick) {
        thumbstick.onAxisValueChangedObservable.add((axes) => {
          inputAxes.x = axes.x // left/right
          inputAxes.y = axes.y // forward/back
        })
      }
    })
  })

  const trigger = motionController.getComponent("xr-standard-trigger");
    if (trigger) {
      trigger.onButtonStateChangedObservable.add(() => {
        if (trigger.changes.pressed && trigger.pressed) {
          const video = videoTexture.video;

          video.muted = false;        // Ensure audio is on
          video.autoplay = false;     // Just to be safe
          video.play().catch((err) => {
            console.warn("Could not play video:", err);
          });
        }
      });
    }

  scene.onBeforeRenderObservable.add(() => {
    if (inputAxes.x !== 0 || inputAxes.y !== 0) {
      const movement = new BABYLON.Vector3(
        inputAxes.x * speed, // X movement
        0,                   // No Y movement
        -inputAxes.y * speed  // Z movement
      )

      xrCamera.position.addInPlace(movement)
    }
  })
})




  engine.runRenderLoop(() => {
    scene.render()
  })

  window.addEventListener('resize', () => {
    engine.resize()
  })
})
