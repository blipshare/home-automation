//import { AudioRecorder } from 'node-audiorecorder'
const AudioRecorder = require('node-audiorecorder')

const options = {
  program: `sox`, // Which program to use, either `arecord`, `rec`, or `sox`.
  device: "hw:1,0", // Recording device to use, e.g. `hw:1,0`

  bits: 16, // Sample size. (only for `rec` and `sox`)
  channels: 1, // Channel count.
  encoding: `signed-integer`, // Encoding type. (only for `rec` and `sox`)
  format: `S16_LE`, // Encoding type. (only for `arecord`)
  rate: 16000, // Sample rate.
  type: `wav`, // Format type.

  // Following options only available when using `rec` or `sox`.
  silence: 2, // Duration of silence in seconds before it stops recording.
  thresholdStart: 0.5, // Silence threshold to start recording.
  thresholdStop: 0.5, // Silence threshold to stop recording.
  keepSilence: true, // Keep the silence in the recording.
}

const logger = console
let recorder = new AudioRecorder(options, logger)

recorder.start()
sleep(3)
recorder.stop()
recorder.stream()