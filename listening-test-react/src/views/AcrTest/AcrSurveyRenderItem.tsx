import React from "react";
import {observer} from "mobx-react";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import {TestItemType} from "../../shared/models/EnumsAndTypes";
import {RenderSurveyControl} from "../../shared/components/RenderSurveyControl";
import {Box, Slider} from "@material-ui/core";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import {RenderTraining} from "../components/RenderTraining";
import {RenderRatingExample} from "../components/RenderRatingExample";

export const AcrSurveyRenderItem = observer(function (props: { item: TestItemModel, active?: boolean }) {
  const {item, ...rest} = props;
  switch (item.type) {
    case TestItemType.question:
      return <RenderSurveyControl control={item.questionControl} {...rest}/>
    case TestItemType.example:
      return <RenderRatingExample value={item.example} RatingBar={AcrRatingBar} {...rest}/>;
    case TestItemType.training:
      return <RenderTraining value={item.example} {...rest}/>;
    default:
      return null;
  }
})

const AcrRatingBar = observer(function (props: { audio: AudioFileModel }) {
  const marks = [
    {value: 1, label: '1 - Bad'},
    {value: 2, label: '2 - Poor'},
    {value: 3, label: '3 - Fair'},
    {value: 4, label: '4 - Good'},
    {value: 5, label: '5 - Excellent'},
  ];

  // Set a default value
  const num = parseInt(props.audio.value);
  if (!num && num !== 0) props.audio.value = '3';

  return <Box ml={2.5} mb={2} mt={2} style={{height: 200}}>
    <Slider orientation="vertical" aria-labelledby="vertical-slider" min={1} max={5} step={1} track={false}
            getAriaValueText={(value: number) => `${value}`} marks={marks}
            value={Number(props.audio.value)}
            onChange={(_, value) => props.audio.value = value.toString()}/>
  </Box>
})

