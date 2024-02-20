import React, {useRef, useState} from 'react';
import SubtitlesParser from 'subtitles-parser';
import Modal from 'react-modal';
import {ReactComponent as MutedIcon} from './icons/muted.svg';
import {ReactComponent as UnMutedIcon} from './icons/unmuted.svg';
import {ReactComponent as StopIcon} from './icons/stop.svg';
import {ReactComponent as PlayIcon} from './icons/play.svg';
import {ReactComponent as FullScreenIcon} from './icons/fullscreen.svg';
import {ReactComponent as SubtitleIcon} from './icons/subtitle.svg';
import {ReactComponent as SettingsIcon} from './icons/settings.svg';

const App = () => {
    const videoRef = useRef(null);
    const [subtitleEnData, setSubtitleEnData] = useState([]);
    const [subtitleFaData, setSubtitleFaData] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);

    //region Modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    //endregion

    //region Handlers
    const handleSubtitleEnChange = (e) => {
        if (e.target.files.length > 0) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const subtitle = SubtitlesParser.fromSrt(e.target.result, false);
                setSubtitleEnData(subtitle);
            };

            reader.readAsText(e.target.files[0]);
        }
    };

    const handleSubtitleFaChange = (e) => {
        if (e.target.files.length > 0) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const subtitle = SubtitlesParser.fromSrt(e.target.result, false);
                setSubtitleFaData(subtitle);
            };

            reader.readAsText(e.target.files[0]);
        }
    };

    const handleVideoChange = (e) => {
        if (e.target.files.length > 0) {
            const videoFile = e.target.files[0];
            videoRef.current.src = URL.createObjectURL(videoFile);
            videoRef.current.load();

            setIsMuted(videoRef.current.muted);
            setIsPlaying(false);
        }
    };
    //endregion

    const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
    };

    const timeToSeconds = (timeString) => {
        const [hh, mm, ss] = timeString.split(':').map(parseFloat);
        const seconds = hh * 3600 + mm * 60 + ss;

        // Extract milliseconds from the time string
        const milliseconds = parseFloat(timeString.split(',')[1]) / 1000;

        return seconds + milliseconds;
    };

    //-------------------------------------------------------
    const renderSubtitleEn = () => {
        const currentSubtitle = subtitleEnData.find(
            (subtitle) =>
                currentTime >= timeToSeconds(subtitle.startTime) &&
                currentTime <= timeToSeconds(subtitle.endTime)
        );

        return currentSubtitle ? currentSubtitle.text : '';
    };

    const renderSubtitleFa = () => {
        const currentSubtitle = subtitleFaData.find(
            (subtitle) =>
                currentTime >= timeToSeconds(subtitle.startTime) &&
                currentTime <= timeToSeconds(subtitle.endTime)
        );

        return currentSubtitle ? currentSubtitle.text : '';
    };

    //-------------------------------------------------------
    const clickPlayPause = () => {
        if (!videoRef.current.currentSrc) {
            alert("Please select a video file first.");
            return;
        }

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }

        setIsPlaying(!isPlaying);
    }

    const clickMuteToggle = () => {
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
    }

    const toggleFullScreen =  () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            });
        }

        // if (!isFullscreen) {
        //     document.documentElement.requestFullscreen().catch((err) => {
        //         console.error('Error attempting to enable full screen:', err);
        //     });
        // } else {
        //     document.documentElement.exitFullscreen().catch((err) => {
        //             console.error('Error attempting to exit full screen:', err);
        //         }
        //     )
        // }
        //
        // setIsFullscreen(!isFullscreen);
    };


    const handleVolumeChange = (e) => {
        const video = videoRef.current;

        if (video) {
            const newVolume = parseFloat(e.target.value);
            video.volume = newVolume;
            setVolume(newVolume);
        }
    };
    //-------------------------------------------------------

    const modalStyle = {
        content: {
            maxWidth: '400px', // Set the maximum width of the modal content
            margin: 'auto',    // Center the modal horizontally
            border: '1px solid #ccc',
            borderRadius: '5px',
            background: 'rgba(65,65,65,0.8)',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            color: '#f4f4f4',
            direction: 'ltr',
        },
        overlay: {
            zIndex: 1000, // Set the overlay z-index to a high value
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Set the overlay background color and transparency
        },
    };


    //-------------------------------------------------------
    return (
        <div className='z-player nex-auto-size flex-col'>
            <div className='nex-video-player nex-subtitle-show nex-layer-show nex-control-show'>
                <video
                    className='video nex-video'
                    ref={videoRef}
                    muted
                    onTimeUpdate={handleTimeUpdate}
                >
                </video>
                <div className='subtitles'>
                    <span className='subtitle-en'>{renderSubtitleEn()}</span>
                    <span className='subtitle-fa'>{renderSubtitleFa()}</span>
                </div>

                <div className="nex-bottom">
                    <div className="nex-progress">
                        <div className="nex-control nex-control-progress" data-index="10">
                            <div className="nex-control-progress-inner">
                                <div className="nex-progress-loaded" style={{width: '3.35324%'}}></div>
                                <div className="nex-progress-played" style={{background: 'rgb(255, 173, 0)', width: '2.35273%'}}></div>
                                <div className="nex-progress-highlight"></div>
                                <div className="nex-progress-indicator" style={{background: 'rgb(255, 173, 0)', left: 'calc(2.35273% - 8px)'}}></div>
                                <div className="nex-progress-tip nex-tip"></div>
                            </div>
                        </div>
                        <div className="nex-control nex-control-loop" data-index="30"><span className="nex-loop-point"></span><span className="nex-loop-point"></span></div>
                    </div>
                    <div className="nex-controls">
                        <div className="nex-controls-left">
                            <div className="nex-control nex-control-playAndPause" data-index="10" onClick={clickPlayPause}>
                                <i aria-label="Play/Pause" className="nex-icon nex-icon-play" data-balloon-pos="up">
                                    {isPlaying ? <StopIcon/> : <PlayIcon/>}
                                </i>
                            </div>

                            <div className="nex-control nex-control-volume" data-index="20">
                                <i
                                    aria-label="Mute"
                                    className="nex-icon nex-icon-volume"
                                    data-balloon-pos="up"
                                    style={{display: 'flex'}}
                                    onClick={clickMuteToggle}
                                >
                                    {isMuted ? <MutedIcon/> : <UnMutedIcon/>}
                                </i>
                                <div className="nex-volume-panel">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={volume}
                                        onChange={handleVolumeChange}
                                        className="nex-volume-slider"
                                    />
                                </div>
                            </div>
                            <div className="nex-control nex-control-time nex-control-onlyText" data-index="30">01:08 / 48:19</div>
                        </div>
                        <div className="nex-controls-right">
                            <div aria-label="Hide subtitle" className="nex-control nex-control-subtitle" data-balloon-pos="up" data-index="30">
                                <i className="nex-icon nex-icon-subtitle">
                                    <SubtitleIcon/>
                                </i>
                            </div>
                            <div aria-label="Show setting" className="nex-control nex-control-setting" data-balloon-pos="up" data-index="40">
                                <i className="nex-icon nex-icon-setting">
                                    <SettingsIcon/>
                                </i>
                            </div>
                            <div aria-label="Fullscreen" className="nex-control nex-control-fullscreen" data-balloon-pos="up" data-index="70" onClick={toggleFullScreen}>
                                <i className="nex-icon nex-icon-fullscreen">
                                    <FullScreenIcon/>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button className='' onClick={openModal}>Open Upload Modal</button>
            <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={modalStyle}>
                <h2>Upload</h2>
                <label className='mt-2 inline-block'>
                    Choose Video:
                    <input type="file" accept=".flv, .mp4, .mkv" onChange={handleVideoChange}/>
                </label>
                <label className='mt-2 inline-block'>
                    Choose First Subtitle:
                    <input type="file" accept=".srt" onChange={handleSubtitleEnChange}/>
                </label>
                <label className='mt-2 inline-block'>
                    Choose Second Subtitle:
                    <input type="file" accept=".srt" onChange={handleSubtitleFaChange}/>
                </label>
                <button className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={closeModal}>Apply</button>
            </Modal>
        </div>
    );
};

export default App;
