const videoUrl = 'https://flamingoflapjack.com/assets/videos/delta%20halo%203-08.mp4';
let videoTexture;
let screenMaterial;

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

  const basePBR = new BABYLON.PBRMaterial("basePBR", scene)

  basePBR.albedoColor = new BABYLON.Color3(0.8, 0.8, 0.8)
  basePBR.metallic = 0.0
  basePBR.roughness = 1.0

  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, -3), scene)
  camera.attachControl(canvas, true)

  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene)
  light.intensity = 0.7

  BABYLON.SceneLoader.ImportMesh(null, "../assets/models/nakagin/", "structure.obj", scene, function (meshes) {

    const model = meshes[0]

    model.position = new BABYLON.Vector3(0, -10, 0)
    model.scaling = new BABYLON.Vector3(.01, .01, .01)
    model.rotation = new BABYLON.Vector3(BABYLON.Tools.ToRadians(270), 0, 0)

    model.material = basePBR
  }
)

  return scene
}


  scene = createScene()

scene.createDefaultXRExperienceAsync({disableTeleportation: false}).then((xr) => {
  const xrCamera = xr.baseExperience.camera
  const speed = 0.05
  let inputAxes = { x: 0, y: 0 }

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
