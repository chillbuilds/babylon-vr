const videoUrl = 'https://flamingoflapjack.com/assets/videos/delta%20halo%203-08.mp4'
let videoTexture
let screenMaterial

window.addEventListener('DOMContentLoaded', () => {

    BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-vr').then((supported) => {
        if (supported) {
            console.log("✅ XR headset is supported on this device")
            // $('#babylonCanvas').attr('style', 'display: inline-block')
        } else {
            console.log("🚫 XR headset NOT supported")
            // $('#message').text('get a dang headset')
        }
    })

  const canvas = document.getElementById('babylonCanvas')
  const engine = new BABYLON.Engine(canvas, true)
  let scene

var createScene = function () {
  scene = new BABYLON.Scene(engine)

  scene.clearColor = BABYLON.Color3.FromHexString("#2364AA");

  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, -3), scene)
  camera.attachControl(canvas, true)
  camera.speed = 0.5; // default is 1.0

  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene)
  light.intensity = 1

  const basePBR = new BABYLON.PBRMaterial("basePBR", scene)
  basePBR.albedoColor = BABYLON.Color3.FromHexString("#FFFFFF");
  basePBR.metallic = 0.0
  basePBR.roughness = 1.0

  const grayMetalPBR = new BABYLON.PBRMaterial("grayMetalPBR", scene)
  grayMetalPBR.albedoColor = new BABYLON.Color3(0.2, 0.2, 0.2)
  grayMetalPBR.metallic = 0.5
  grayMetalPBR.roughness = 1.0

  const lightGrayMetalPBR = new BABYLON.PBRMaterial("lightGrayMetalPBR", scene)
  lightGrayMetalPBR.albedoColor = new BABYLON.Color3(0.4, 0.4, 0.4)
  lightGrayMetalPBR.metallic = 0.8
  lightGrayMetalPBR.roughness = 0.8

  const bathroomFloorPBR = new BABYLON.PBRMaterial("bathroomFloorPBR", scene)
  bathroomFloorPBR.albedoColor = BABYLON.Color3.FromHexString("#E3D26F");
  bathroomFloorPBR.metallic = 0.0
  bathroomFloorPBR.roughness = 1.0

  const floorPBR = new BABYLON.PBRMaterial("floorPBR", scene)
  floorPBR.albedoColor = BABYLON.Color3.FromHexString("#226CE0");
  floorPBR.metallic = 0.0
  floorPBR.roughness = 1.0

  const glassPBR = new BABYLON.PBRMaterial("glassPBR", scene)
  glassPBR.emissiveColor  = BABYLON.Color3.FromHexString("#FFFFFF");
  glassPBR.metallic = 0.5
  glassPBR.roughness = 1.0
  glassPBR.alpha = 0.2

  let formatModel = (model, pbr) => {
    model.position = new BABYLON.Vector3(0, -10, 0)
    model.scaling = new BABYLON.Vector3(.01, .01, .01)
    model.rotation = new BABYLON.Vector3(BABYLON.Tools.ToRadians(270), 0, 0)

    model.material = pbr
  }

  const modelPaths = [
    "cabinets/cabinet-1a.obj",
    "cabinets/cabinet-1b.obj",
    "cabinets/cabinet-1c.obj",
    "cabinets/cabinet-2a.obj",
    "cabinets/cabinet-2b.obj",
    "cabinets/cabinet-3a.obj",
    "cabinets/cabinet-3b.obj",
    "cabinets/cabinet-3c.obj",
    "cabinets/cabinet-3d.obj",
    "cabinets/cabinet-3e.obj",
    "cabinets/cabinet-3f.obj",
    "cabinets/cabinet-4a.obj",
    "cabinets/cabinet-4b.obj",
    "cabinets/cabinet-4c.obj",
    "cabinets/cabinet-5a.obj",
    "cabinets/cabinet-5b.obj",
    "sink/sink-basin.obj",
  ]

  modelPaths.forEach(model => {
    BABYLON.SceneLoader.ImportMesh(null, "../assets/models/nakagin/", model, scene, function (meshes) {
      formatModel(meshes[0], basePBR)
    })
  })

    const metalmodels = [
    "sink/tap.obj",
    "sink/sink-drain.obj",
    "sink/handle-1.obj",
    "sink/handle-2.obj",
    "sink/toilet-paper-holder.obj",
    "sink/toilet-paper-rod.obj",
    "vents/vent-1a.obj",
    "vents/vent-1b.obj",
    "vents/vent-2a.obj",
    "vents/vent-2b.obj",
  ]

  metalmodels.forEach(model => {
    BABYLON.SceneLoader.ImportMesh(null, "../assets/models/nakagin/", model, scene, function (meshes) {
      formatModel(meshes[0], lightGrayMetalPBR)
    })
  })


  BABYLON.SceneLoader.ImportMesh(null, "../assets/models/nakagin/", "structure.obj", scene, function (meshes) {
    formatModel(meshes[0], basePBR)
  })
  BABYLON.SceneLoader.ImportMesh(null, "../assets/models/nakagin/", "door-frame.obj", scene, function (meshes) {
    formatModel(meshes[0], grayMetalPBR)
  })
  BABYLON.SceneLoader.ImportMesh(null, "../assets/models/nakagin/", "bathroom-floor.obj", scene, function (meshes) {
    formatModel(meshes[0], bathroomFloorPBR)
  })
  BABYLON.SceneLoader.ImportMesh(null, "../assets/models/nakagin/", "toilet-seat.obj", scene, function (meshes) {
    formatModel(meshes[0], bathroomFloorPBR)
  })
  BABYLON.SceneLoader.ImportMesh(null, "../assets/models/nakagin/", "floor.obj", scene, function (meshes) {
    formatModel(meshes[0], floorPBR)
  })
  BABYLON.SceneLoader.ImportMesh(null, "../assets/models/nakagin/", "window.obj", scene, function (meshes) {
    formatModel(meshes[0], glassPBR)
  })

  return scene
}


  scene = createScene()

scene.createDefaultXRExperienceAsync({disableTeleportation: true}).then((xr) => {
  const xrCamera = xr.baseExperience.camera
  const speed = 0.05
  let inputAxes = { x: 0, y: 0 }

xr.input.onControllerAddedObservable.add((controller) => {
  controller.onMotionControllerInitObservable.add((motionController) => {
    const thumbstick = motionController.getComponent("xr-standard-thumbstick")
    if (thumbstick) {
      thumbstick.onAxisValueChangedObservable.add((axes) => {
        inputAxes.x = axes.x
        inputAxes.y = axes.y
      })
    }

    const trigger = motionController.getComponent("xr-standard-trigger")
    if (trigger) {
      trigger.onButtonStateChangedObservable.add(() => {
        if (trigger.value >= 0.8) {
            socket.send('trigger pulled')
        }
      })
    }

    const aBtn = motionController.getComponent("a-button")
    if (aBtn) {
      aBtn.onButtonStateChangedObservable.add(() => {
        if (aBtn.pressed) {
            socket.send('a-button pressed')
        }
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
