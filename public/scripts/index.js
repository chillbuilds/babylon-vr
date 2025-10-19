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
  let scene

var createScene = function () {
  scene = new BABYLON.Scene(engine)

  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene)
  camera.setTarget(BABYLON.Vector3.Zero())
  camera.attachControl(canvas, true)

  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene)
  light.intensity = 0.7

  // Await model loading, but don't return the promise directly
  BABYLON.SceneLoader.AppendAsync('/assets/models/', 'train.glb', scene).then((result) => {
    console.log(scene.meshes)
    //   scene.meshes.forEach(mesh => {
    //     mesh.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
    //   })
  })

  // Now return the scene normally
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
