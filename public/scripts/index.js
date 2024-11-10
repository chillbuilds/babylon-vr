let canvas = document.getElementById('babylonCanvas')
let engine = new BABYLON.Engine(canvas, true)

const createScene = function () {
    let canvas = document.getElementById('babylonCanvas')
    let engine = new BABYLON.Engine(canvas, true)

    const scene = new BABYLON.Scene(engine)
    var xrHelper = scene.createDefaultXRExperienceAsync()
    return scene
}

createScene()