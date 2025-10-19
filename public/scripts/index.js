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

  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, -3), scene)
//   camera.setTarget(new BABYLON.Vector3(0, 0, 0))
  camera.attachControl(canvas, true)

  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene)
  light.intensity = 0.7

  const beforeMeshes = scene.meshes.slice();

  BABYLON.SceneLoader.AppendAsync('/assets/models/', 'train.glb', scene).then(() => {
    const newMeshes = scene.meshes.filter(m => !beforeMeshes.includes(m))

    // Try to find the root node
    const root = newMeshes.find(m => m.name === "__root__" || !m.parent)

    if (root) {
      root.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01)
    } else {
      console.log("Could not find root mesh to scale")
    }
  })

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
