import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import React, { useEffect, useState } from 'react';
import { GenericPlugin } from 'wavesurfer.js/dist/base-plugin';
import { WaveSurferPlugin } from 'wavesurfer.js/types/plugin';
import  create  from 'wavesurfer.js';
import axios from 'axios';

let wavesurfer: any;
let record: RecordPlugin;
let scrollingWaveForm: boolean = false;

declare module 'wavesurfer.js' {
    interface WaveSurfer {
        record: RecordPlugin;
        regions: RegionsPlugin;
    }
}


const WaveSurferComponent = () => {
    const [wave, setWave] = useState<object[] | null>([]);
    const [display, setDisplay] = useState<boolean>(false); 
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    
    const createSoundWaves = (containeId: string) => {
        let regions: RegionsPlugin
        //if there is a wavesurfer already, destroy it
        if (wavesurfer) {
            wavesurfer.destroy();
        }
        //create the new wave
        console.log('creating new wave')
        wavesurfer = WaveSurfer.create({
            barWidth: 15,
            barRadius: 5,
            barGap: 2,
            interact: true,
            container: '#waveform',
            waveColor: 'rgb(0, 255, 0)',
            progressColor: 'rgb(0, 0, 255)',
            url: 'https://cdn.freesound.org/previews/462/462807_8386274-lq.mp3',
            width: "auto",
            height: "auto",
            normalize: true,
        });

        regions = wavesurfer.registerPlugin(RegionsPlugin.create());


        // wavesurfer.on('interaction', () => {
        //     wavesurfer.play();
        // });
        wavesurfer.on('click', () => {
            regions.addRegion({
                start: wavesurfer.getCurrentTime(),
                end: wavesurfer.getCurrentTime() + 0.25,
                drag: true,
                color: 'hsla(250, 100%, 30%, 0.5)',
                id: 'test',
            })
        })
        // wavesurfer.on('decode', () => { THIS CODE WORKS AND IS LEFT COMMENTED OUT UNTIL SOMEONE NEEDS TO USE IT,
        //     regions.addRegion({          IT ADDS A REGIONE TO THE WAVE FORM THAT THE USER CAN DRAG TO HIGHLIGHT SPECIFIC PARTS OF THE WAVE
        //         start: 0.25,         THIS WILL BE TINKERED WITH A LOT FOR USER CREATED SOUNDS
        //         end: 0.5,
        //         drag: true,
        //         color: 'hsla(250, 100%, 30%, 0.5)',
        //     })
        // })
        
        console.log('wave created!', wavesurfer)
        setWave(wavesurfer);
        setDisplay(true);
    }

    useEffect(() => {
        createSoundWaves();
        console.log('wave', wave);
    }, []);
    return (
        <div>
            <h1>WaveSurfer</h1>
            <div id="waveform"></div>
            <button type='button' id="play-btn" onClick={() => {
                if (wavesurfer) {
                    wavesurfer.playPause();
                    setIsPlaying(!isPlaying);
                }
            }}>{isPlaying ? 'Stop' : 'Play'}</button>
        </div>
    )
}

export default WaveSurferComponent;