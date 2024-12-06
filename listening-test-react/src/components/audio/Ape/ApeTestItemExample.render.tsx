import {observer} from "mobx-react";
import {AudioExampleModel, AudioFileModel} from "../../../shared/models/AudioTestModel";
import React, {useEffect, useState, forwardRef,useRef} from "react";
import Grid from "@material-ui/core/Grid";
import {SurveyControlRender} from "../../forms/SurveyControl.render";
import {AudioButton, AudioController, useAudioPlayer} from "../../web-audio/AudiosPlayer";
import {AudioLoading, useAllAudioRefsReady} from "../../web-audio/AudiosLoading";
import {useRandomization} from "../../../shared/tools/RandomizationTools";
import {ratingAreaStyle} from "../../../shared/SharedStyles";
import {AudioSectionLoopingController} from "../../web-audio/AudioSectionLoopingController";
import {Box, Slider, styled } from "@material-ui/core";
import { trace } from "console";
import Button from '@material-ui/core/Button';
import { values } from "mobx";

export const ApeTestItemExampleRender = observer(function (props: { example: AudioExampleModel, active?: boolean }) {
  const {example, active} = props;
  // Randomize first to make sure random audio match the dom tree
  const [randomAudios] = useRandomization(example.medias, active && example.settings?.randomMedia, example.settings?.fixLastInternalQuestion);
  // This is a custom hook that expose some functions for AudioButton and Controller
  const {refs, sampleRef, currentTime, handleTimeUpdate, handlePlay, handlePause, handleEnded} = useAudioPlayer(randomAudios, example.mediaRef, example);
  const allRefs = example.mediaRef ? [...refs, sampleRef] : refs;
  const loading = useAllAudioRefsReady(allRefs);
  // An event for setting Time update method
  const [onTimeUpdate, setOnTimeUpdate] = useState<() => void>();

  useEffect(() => {
    if (active === false) handlePause();
  }, [active]);

  return <> <AudioLoading showing={loading}/>
    <Grid container spacing={2} style={{display: loading ? 'none' : 'flex'}}>
      {example.fields?.map((value, i) => <Grid item xs={12} key={i}>
        <SurveyControlRender control={value}/>
      </Grid>)}

      {randomAudios.map((v, i) => 
      <Grid item key={i} >
        {/* <ApeRatingBar audio={v} audioNum = {i + 1}/> */}
        <ApeAudioButton 
                    ref={refs[i]} 
                    audio={v} 
                    audioNum={i+1}
                    onPlay={handlePlay} 
                    onPause={handlePause}
                    onEnded={i === 0 ? handleEnded : undefined}
                    onTimeUpdate={i === 0 ? onTimeUpdate ? onTimeUpdate : handleTimeUpdate : undefined}>{i + 1}</ApeAudioButton>

      </Grid>)}

      {/*Reference*/}
      {example.mediaRef && <Grid item style={ratingAreaStyle}>
        <AudioButton ref={sampleRef} audio={example.mediaRef}  onPlay={handlePlay} onPause={handlePause}>Ref</AudioButton>
        {/*{isDevMode() && <span>{sampleRef?.current?.currentTime}</span>}*/}
      </Grid>}

      <Grid item xs={12}>
        <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}
                         disabled={example.settings?.disablePlayerSlider}/>
        {example.settings?.sectionLooping &&
        <AudioSectionLoopingController setTimeUpdate={f => setOnTimeUpdate(f)} refs={allRefs}
                                       currentTime={currentTime}/>}
      </Grid>
    </Grid>
  </>
});

const marks = [
  {value: 0, label: '0'},
  {value: 20, label: '20'},
  {value: 40, label: '40'},
  {value: 60, label: '60'},
  {value: 80, label: '80'},
  {value: 100, label: '100'},
];

export const ApeRatingBar = observer(function (props: { audio: AudioFileModel ,audioNum:number}) {
  useEffect(() => {
    // Set a default value
    const num = parseInt(props.audio.value);
    if (!num) props.audio.value = '0';
  });

    return <>
    <Box ml={2.5} mb={2} mt={2} style={{position: 'absolute',width: 200,height: 50}}>
      <HiddenSlider

          value={Number(props.audio.value)}
          min={0}
          max={100}
          step={1}
          marks={marks}
          valueLabelDisplay="auto"
          onChange={(_, value) => props.audio.value = value.toString()}
          isActive={false}
          displayNumber = {props.audioNum}

        />

    </Box>
    </>
  })

const HiddenSlider = styled(Slider)(({ theme , isActive, displayNumber }: { 
  theme: any, 
  isActive: boolean,
  displayNumber : number, 
}) => ({
  
  '& .MuiSlider-track': {
    visibility: 'hidden', // 隐藏轨道
  },
  // '& .MuiSlider-rail': {
  //   visibility: 'hidden', // 隐藏轨道背景
  // },
  

  '& .MuiSlider-thumb': {
    backgroundColor: isActive ? theme.palette.primary.main : theme.palette.common.white,
    border: `1px solid ${theme.palette.primary.main}`,
    // width: 6,
    height: 64,
    borderRadius: 3,
    transform: 'translateY(-27px)',
    // display: 'none' ,
    
    '&:before': {
      content: `"${displayNumber}"`,
      color: !isActive ? theme.palette.primary.main : theme.palette.common.white,
      fontSize: '14px',
    },
  },
}));


const ApeAudioButton = observer(
  forwardRef<
    HTMLAudioElement,
    {
      audio: AudioFileModel;
      audioNum: number;
      onPlay: (v: AudioFileModel) => void;
      onPause: () => void;
      onTimeUpdate?: () => void;
      onEnded?: () => void;
      children?: any;
    }
  > (function (props, ref) {
    useEffect(() => {
      // Set a default value
      const num = parseInt(audio.value);
      if (!num) audio.value = '0';
    });
    const { audio,audioNum, onTimeUpdate, onPlay, onPause, onEnded } = props;
    const [startX, setStartX] = useState(0);
    
    const handleChangeCommited = (event: React.ChangeEvent<{}>, value: number | number[]) => {
      // audio.value = value.toString();  // 将滑块的值转换为字符串并赋值给 audio.value
      // console.log("change: "+audio.value)
      if (Number(audio.value) == startX) {
        // console.log("switch!")
        audio.isActive ? onPause() : onPlay(audio);
      }
    }

    return (
      <>
        <audio
          preload="auto"
          src={audio.src}
          controls
          ref={ref}
          style={{ display: 'none' }}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
        />
        <Box ml={2.5} mb={2} mt={2} style={{width: 200,height: 50}}>
        
          <HiddenSlider

            value={Number(audio.value)}
            min={0}
            max={100}
            step={1}
            marks={marks}
            valueLabelDisplay="auto"
            onChange={(_, value) => audio.value = value.toString()}

            isActive={audio.isActive}
            displayNumber = {audioNum}

            onChangeCommitted={handleChangeCommited}
            onMouseDown={() => setStartX(Number(audio.value))}
            
          />
        </Box>

      </>
    );
  })
);