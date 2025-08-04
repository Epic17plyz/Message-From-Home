import * as rm from "https://deno.land/x/remapper@4.1.0/src/mod.ts"
import * as bundleInfo from './bundleinfo.json' with { type: 'json' }

const pipeline = await rm.createPipeline({ bundleInfo })

const bundle = rm.loadBundle(bundleInfo)
const materials = bundle.materials
const prefabs = bundle.prefabs

// ----------- { SCRIPT } -----------

async function doMap(file: rm.DIFFICULTY_NAME) {
    const map = await rm.readDifficultyV3(pipeline, file)

//Map Setup
map.require(rm.MODS.CHROMA)
map.require(rm.MODS.NOODLE_EXTENSIONS)
map.require(rm.MODS.VIVIFY)

map.difficultyInfo.settingsSetter.playerOptions.hideNoteSpawnEffect = true
map.difficultyInfo.settingsSetter.playerOptions.leftHanded = false
map.difficultyInfo.settingsSetter.playerOptions.noTextsAndHuds = true
map.difficultyInfo.settingsSetter.playerOptions.noteJumpDurationTypeSettings = 'Dynamic'
map.difficultyInfo.settingsSetter.playerOptions.sfxVolume = 0
map.difficultyInfo.settingsSetter.playerOptions.reduceDebris = false
map.difficultyInfo.settingsSetter.playerOptions.noteJumpStartBeatOffset = 0
map.difficultyInfo.settingsSetter.graphics.maxShockwaveParticles = 0
map.difficultyInfo.settingsSetter.graphics.mirrorGraphicsSettings = 'Off'

rm.environmentRemoval(map, [
    'Environment',
    'GameCore'
])
rm.adjustFog(map, {
    attenuation: 0
})
rm.setRenderingSettings(map, {
    qualitySettings: {
        shadows: 2,
        shadowResolution: 3,
        shadowDistance: 3000
    },
    renderSettings: {
        flareStrength: 1,
        flareFadeSpeed: 3,

    }
})
rm.setRenderingSettings(map, {
    beat: 116,
    qualitySettings: {
        shadows: 0
    }
})

//Vivify
const prefab = prefabs.saturn.instantiate(map, {
    position: [700,200,2000],
    rotation: [10,0,0],
    scale: [75,75,75]
})
const prefab1 = prefabs.saturn.instantiate(map, {
    beat: 55,
    position: [2200,100,0],
    rotation: [10,0,0],
    scale: [400,400,400]
})
const prefab2 = prefabs.saturn.instantiate(map, {
    beat: 102,
    position: [0,-1500,-100],
    rotation: [10,0,0],
    scale: [300,300,300]
})
prefabs.saturn.instantiate(map, {
    beat: 116,
    position: [-300,4800,1200],
    rotation: [10,0,0],
    scale: [1000,1000,1000]
})
prefabs["point light"].instantiate(map, {
    position: [20,180,3500],
    track: 'end'
})
const prefab3 = prefabs.sun.instantiate(map, {
    position: [-700,500,3700],
    scale: [30,30,30]
})
prefabs.thunder.instantiate(map, {
    beat: 132,
    position: [60,400,30],
    track: 'thunder'
})

//Destroy Objects
prefab.destroyObject(55)
prefab1.destroyObject(102)
prefab2.destroyObject(116)
prefab3.destroyObject(116)

//Notemods
map.allNotes.forEach(note => {
    note.animation.offsetPosition = [
        [-300,-60,900,0],
        [0,0,20,.43,'easeOutQuart'],
        [0,0,0,.5]
    ]
      note.animation.offsetWorldRotation = [
        [0,40,0,0],
        [0,'baseHeadRotation.s1.y',0,.43,'easeOutSine']
    ]
    rm.assignTrackParent(map, {
        childrenTracks: ['note'],
        parentTrack: 'player'
    })
    note.track.add('note')
    note.disableNoteLook = true
    note.life = (55)
})

//Tracks
rm.animateTrack(map, {
    beat:0,
    duration: 145.005707,
    track: 'player',
    animation: {
        position: [
            [0,200,0,0]
        ]
    }
})
rm.assignPlayerToTrack(map, {
    track: 'player'
})
rm.animateTrack(map, {
    beat: 140,
    duration: 4.005707,
    track: 'end',
    animation: {
        localPosition: [
            [20,180,3500,0],
            [0,0,6969,.9]
        ]
    }
})
rm.animateTrack(map, {
    beat: 144,
    duration: 1.005707,
    track: 'thunder',
    animation: {
        position: [
            [60,400,30,0],
            [60,1000,30,1]
        ]
    }
})

}

//Output
await Promise.all([
    doMap('ExpertPlusStandard'),
    doMap('ExpertPlusLightshow')
])

// ----------- { OUTPUT } -----------

pipeline.export({
    outputDirectory: '../OutputMaps'
})
