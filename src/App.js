import React, {useEffect, useRef, useState} from 'react';
import SubtitlesParser from 'subtitles-parser';
import Modal from 'react-modal';
import {ReactComponent as MutedIcon} from './icons/muted.svg';
import {ReactComponent as UnMutedIcon} from './icons/unmuted.svg';
import {ReactComponent as StopIcon} from './icons/stop.svg';
import {ReactComponent as PlayIcon} from './icons/play.svg';
import {ReactComponent as FullScreenIcon} from './icons/fullscreen.svg';
import {ReactComponent as SubtitleIcon} from './icons/subtitle.svg';
import {ReactComponent as SettingsIcon} from './icons/settings.svg';
import {ReactComponent as UploadIcon} from './icons/upload.svg';

const App = () => {
    let isActiveProgress = false;
    const videoRef = useRef(null);
    // const [activeSubtitleIndex, setActiveSubtitleIndex] = useState(0);
    const [subtitleFirstData, setSubtitleFirstData] = useState([]);
    const [subtitleSecondData, setSubtitleSecondData] = useState([]);
    const [durationTime, setDurationTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [progress, setProgress] = useState(0);
    const [isMouseMoving, setIsMouseMoving] = useState(true);
    const [isShowHideSubtitles, setIsShowHideSubtitles] = useState(true);
    const [isShowHideSettings, setIsShowHideSettings] = useState(false);
    const [isShowHideSubtitleList, setIsShowHideSubtitleList] = useState(false);

    //region Modal (openModal, openModal)
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    //endregion

    //region Handlers (handleVideoChange, handleSubtitleFirstChange, handleSubtitleSecondChange)
    const handleChooseMedia = (e) => {
        if (e.target.files.length > 0) {
            const videoFile = e.target.files[0];
            videoRef.current.src = URL.createObjectURL(videoFile);
            videoRef.current.load();

            setIsMuted(videoRef.current.muted);
            setProgress(0);
        }
    };

    const handleChooseSubtitle_First = (e) => {
        chooseSubtitle(e, 'first');
    };

    const handleChooseSubtitle_Second = (e) => {
        chooseSubtitle(e, 'second');
    };

    function chooseSubtitle(e, type) {
        if (e.target.files.length > 0) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const subtitle = SubtitlesParser.fromSrt(e.target.result, false);

                if (type === 'first')
                    setSubtitleFirstData(subtitle);
                else
                    setSubtitleSecondData(subtitle);
            };

            reader.readAsText(e.target.files[0]);
        }
    }

    //endregion

    //region Video Element (handleVideoTimeUpdate, handleVideoLoadedMetadata)
    const handleVideoTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);

        if (!isActiveProgress) {
            if (durationTime !== 0) {
                setProgress(videoRef.current.currentTime / durationTime);
            }
        }

        if (videoRef.current.currentTime === durationTime && durationTime !== 0) {
            setIsPlaying(false);
        }
    }

    function handleVideoLoadedMetadata() {
        setDurationTime(videoRef.current.duration);
        setIsPlaying(true);
    }

    //endregion

    //region Utils (timeToSeconds, formatTime)
    const timeToSeconds = (timeString) => {
        const [hh, mm, ss] = timeString.split(':').map(parseFloat);
        const seconds = hh * 3600 + mm * 60 + ss;

        // Extract milliseconds from the time string
        const milliseconds = parseFloat(timeString.split(',')[1]) / 1000;

        return seconds + milliseconds;
    };

    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.floor(timeInSeconds % 60);

        let formattedTime
        if (hours > 0) {
            formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else {
            formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        return formattedTime;
    };
    //endregion

    //region Subtitle (renderSubtitleFirst, renderSubtitleSecond)
    const renderSubtitleFirst = () => {
        return findSubtitleByTime(subtitleFirstData, currentTime)
    };

    const renderSubtitleSecond = () => {
        return findSubtitleByTime(subtitleSecondData, currentTime)
    };

    let xx

    function findSubtitleByTime(subtitles, time) {
        const currentSubtitle = subtitles.find(
            (subtitle) =>
                time >= timeToSeconds(subtitle.startTime) &&
                time <= timeToSeconds(subtitle.endTime)
        );

        if (currentSubtitle) xx = currentSubtitle.id;
        // if (currentSubtitle) setActiveSubtitleIndex(currentSubtitle.id);

        return currentSubtitle ? currentSubtitle.text : '';
    }

    //endregion

    //region Controls (
    // handleClickPlayPause,
    // handleClickMuteToggle,
    // handleChangeVolume,
    // handleChangeProgress,
    // handleToggleFullScreen,
    // handleToggleShowHideSettings,
    // handleToggleShowHideSubtitle,
    // handleToggleShowHideSubtitleList
    // )
    const handleClickPlayPause = () => {
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

    const handleClickMuteToggle = () => {
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
    }

    const handleChangeVolume = (e) => {
        if (videoRef.current) {
            const newVolume = parseFloat(e.target.value);
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
        }
    };

    const handleChangeProgress = (e) => {
        isActiveProgress = true;

        if (videoRef.current) {
            const newProgress = parseFloat(e.target.value);
            videoRef.current.currentTime = newProgress * durationTime;
            setProgress(newProgress);
        }

        isActiveProgress = false;
    };

    const handleToggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                // setIsFullscreen(true);
            });
        } else {
            document.exitFullscreen().then(() => {
                // setIsFullscreen(false);
            });
        }
    };

    const handleToggleShowHideSettings = () => {
        setIsShowHideSettings(!isShowHideSettings);
    }

    const handleToggleShowHideSubtitle = () => {
        setIsShowHideSubtitles(!isShowHideSubtitles);
    }

    const handleToggleShowHideSubtitleList = () => {
        setIsShowHideSubtitleList(!isShowHideSubtitleList);
    }

    //endregion

    useEffect(() => {
        let mouseMoveTimer;

        const handleMouseMove = () => {
            setIsMouseMoving(true);

            // Reset the timer when the mouse moves
            clearTimeout(mouseMoveTimer);

            // Set a timeout to hide 'nex-bottom' after a delay
            mouseMoveTimer = setTimeout(() => {
                setIsMouseMoving(false);
            }, 2000); // Adjust the delay (in milliseconds) as needed
        };

        document.addEventListener('mousemove', handleMouseMove);

        // Clean up the event listener when the component is unmounted
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [setIsMouseMoving]);

    function handleSwitchToVideoSubtitle(id) {

    }

    //-------------------------------------------------------
    return (
        <>
            <div className='flex flex-row flex-grow-[-1]'>
                <div className='z-player nex-auto-size flex-col'>
                    <div className='nex-video-player nex-subtitle-show nex-layer-show nex-control-show'>
                        <video
                            className='nex-video'
                            ref={videoRef}
                            /*muted*/
                            autoPlay
                            onDoubleClick={handleToggleFullScreen}
                            onClick={handleClickPlayPause}
                            onTimeUpdate={handleVideoTimeUpdate}
                            onLoadedMetadata={handleVideoLoadedMetadata}
                        >
                        </video>
                        <div data-testid='div-show-hide-subtitle' className={isShowHideSubtitles ? 'subtitles' : 'none'}>
                            <span className='subtitle-en'>{renderSubtitleFirst()}</span>
                            <span className='subtitle-fa'>{renderSubtitleSecond()}</span>
                        </div>
                        <div data-testid='div-video-progress-and-controls' className={`nex-bottom ${isMouseMoving || !isPlaying ? 'opacity-90' : 'opacity-0'}`}>
                            <div data-testid='div-video-progress-bar' className="nex-progress">
                                <div className="nex-control nex-control-progress" data-index="10">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.0001"
                                        value={progress}
                                        onChange={handleChangeProgress}
                                        className="x-progress"
                                    />
                                </div>
                            </div>
                            <div data-testid='div-video-controls' className="nex-controls">
                                <div className="nex-controls-left">
                                    <div className="nex-control nex-control-playAndPause" data-index="10" onClick={handleClickPlayPause}>
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
                                            onClick={handleClickMuteToggle}
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
                                                onChange={handleChangeVolume}
                                                className="nex-volume-slider"
                                            />
                                        </div>
                                    </div>
                                    <div className="nex-control nex-control-time nex-control-onlyText" data-index="30">
                                        {formatTime(currentTime)} / {formatTime(durationTime)}
                                    </div>
                                </div>
                                <div className="nex-controls-right">
                                    <div aria-label="Upload files" className="nex-control nex-control-subtitle" data-balloon-pos="up" data-index="30" onClick={openModal}>
                                        <i className="nex-icon nex-icon-subtitle">
                                            <UploadIcon/>
                                        </i>
                                    </div>
                                    <div aria-label={isShowHideSubtitles ? "Hide subtitle" : "Show subtitle"} className="nex-control nex-control-subtitle" data-balloon-pos="up" data-index="30" onClick={handleToggleShowHideSubtitle}>
                                        <i className="nex-icon nex-icon-subtitle">
                                            <SubtitleIcon/>
                                        </i>
                                    </div>
                                    <div aria-label={isShowHideSubtitleList ? "Show the full subtitle" : "Show the full subtitle"} className="nex-control nex-control-subtitle" data-balloon-pos="up" data-index="30" onClick={handleToggleShowHideSubtitleList}>
                                        <i className="nex-icon nex-icon-subtitle">
                                            <SubtitleIcon/>
                                        </i>
                                    </div>
                                    <div aria-label="Show setting" className="nex-control nex-control-setting" data-balloon-pos="up" data-index="40" onClick={handleToggleShowHideSettings}>
                                        <i className="nex-icon nex-icon-setting">
                                            <SettingsIcon/>
                                        </i>
                                    </div>
                                    <div aria-label="Fullscreen" className="nex-control nex-control-fullscreen" data-balloon-pos="up" data-index="70" onClick={handleToggleFullScreen}>
                                        <i className="nex-icon nex-icon-fullscreen">
                                            <FullScreenIcon/>
                                        </i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div data-testid='div-show-hide-setting' className={`nex-settings ${isShowHideSettings ? 'visible' : 'invisible'}`} onClick={handleToggleShowHideSettings}>
                            <div className={`nex-setting-inner nex-backdrop-filter ${isShowHideSettings ? 'right-0' : 'right-[-300px]'}`}>
                                <div className="nex-setting-body">
                                    <div className="nex-setting nex-setting-flip" data-index="2">
                                        <div className="nex-setting-header">Flip</div>
                                        <div className="nex-setting-radio">
                                            <div className="nex-radio-item current">
                                                <button data-value="normal" type="button">Normal</button>
                                            </div>
                                            <div className="nex-radio-item">
                                                <button data-value="horizontal" type="button">Horizontal</button>
                                            </div>
                                            <div className="nex-radio-item">
                                                <button data-value="vertical" type="button">Vertical</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="nex-setting nex-setting-rotate" data-index="3">
                                        <div className="nex-setting-header">Rotate: <span className="nex-rotate-value">0°</span></div>
                                        <div className="nex-setting-radio">
                                            <div className="nex-radio-item">
                                                <button data-value="90" type="button">+90°</button>
                                            </div>
                                            <div className="nex-radio-item">
                                                <button data-value="-90" type="button">-90°</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="nex-setting nex-setting-aspectRatio" data-index="4">
                                        <div className="nex-setting-header">Aspect ratio</div>
                                        <div className="nex-setting-radio">
                                            <div className="nex-radio-item current">
                                                <button data-value="default" type="button">Default</button>
                                            </div>
                                            <div className="nex-radio-item">
                                                <button data-value="4:3" type="button">4:3</button>
                                            </div>
                                            <div className="nex-radio-item">
                                                <button data-value="16:9" type="button">16:9</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="nex-setting nex-setting-playbackRate" data-index="5">
                                        <div className="nex-setting-header">Play speed: <span className="nex-subtitle-value">1</span>x</div>
                                        <div className="nex-setting-range"><input className="nex-subtitle-range" max="2" min="0.5" step="0.25" type="range" value="1"/></div>
                                    </div>
                                    <div className="nex-setting nex-setting-subtitleOffset" data-index="20">
                                        <div className="nex-setting-header">Subtitle offset time: <span className="nex-subtitle-value">0</span>s</div>
                                        <div className="nex-setting-range"><input className="nex-subtitle-range" id="subtitleSync" max="999" min="-999" step="0.5" type="range" value="0"/>
                                            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '8px'}}>
                                                <button className="sync-btn" data-val="-5" id="minusfivesec">-5s</button>
                                                <button className="sync-btn" data-val="-0.5" id="minushalfsec">-0.5s</button>
                                                <button className="sync-btn" data-val="+0.5" id="plushalfsec">+0.5s</button>
                                                <button className="sync-btn" data-val="+5" id="plusfivesec">+5s</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="nex-setting nex-setting-localVideo" data-index="30">
                                        <div className="nex-setting-header">Local Video</div>
                                        <div className="nex-setting-upload">
                                            <div className="nex-upload-btn" style={{position: 'relative'}}>Open<input style={{position: 'absolute', width: '100%', height: '100%', left: '0px', top: '0px', opacity: 0}} type="file"/></div>
                                            <div className="nex-upload-value"></div>
                                        </div>
                                    </div>
                                    <div className="nex-setting nex-setting-localSubtitle" data-index="40">
                                        <div className="nex-setting-header">Local Subtitle</div>
                                        <div className="nex-setting-upload">
                                            <div className="nex-upload-btn" style={{position: 'relative'}}>Open<input style={{position: 'absolute', width: '100%', height: '100%', left: '0px', top: '0px', opacity: 0}} type="file"/></div>
                                            <div className="nex-upload-value"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div data-testid='div-show-hide-subtitle-list' className={`subtitle-sidebar ${isShowHideSubtitleList ? 'visible' : 'invisible'}`}>
                        <div className={`subtitle-sidebar-inner nex-backdrop-filter ${isShowHideSubtitleList ? 'right-0' : 'right-[-300px]'}`}>
                            <div className="flex bg-gray-200">
                                <div className="flex-initial text-gray-700 text-center bg-gray-400 px-4 py-2 m-2 flex-1">

                                </div>
                                <div className="flex-initial text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">

                                </div>
                            </div>
                            <div className="subtitle-sidebar-body">
                                <span onClick={handleToggleShowHideSubtitleList}>Close</span>
                                <div className="nex-setting nex-setting-localVideo" data-index="30">
                                    <div className="nex-setting-header">Local Video</div>
                                    <div className="nex-setting-upload">
                                        <div className="nex-upload-btn" style={{position: 'relative'}}>Open<input style={{position: 'absolute', width: '100%', height: '100%', left: '0px', top: '0px', opacity: 0}} type="file"/></div>
                                        <div className="nex-upload-value"></div>
                                    </div>
                                </div>
                                <div className="nex-setting nex-setting-localSubtitle" data-index="40">
                                    <ul>
                                        {
                                            subtitleFirstData.map((item, index) => (
                                                <li key={index}>
                                                    <div className={`subtitle-item ${xx === item.id ? 'subtitle-item-active' : ''}`}>
                                                        <div className='timeBox flex flex-row' onClick={() => handleSwitchToVideoSubtitle(item.id)}>
                                                            <span className="flex-initial">▶</span>
                                                            <span className="flex-initial">{item.startTime.split(',')[0]}</span>
                                                        </div>
                                                        <div className='textBox ml-1 flex-1'>{item.text}</div>
                                                    </div>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={{
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
            }}>
                <h2 className='text-2xl font-bold mb-4'>Upload</h2>
                <label className='mt-4 inline-block'>
                    Choose Video:
                    <input type="file" accept=".flv, .mp4, .mkv, .mp3" onChange={handleChooseMedia}/>
                </label>
                <label className='mt-4 inline-block'>
                    Choose First Subtitle:
                    <input type="file" accept=".srt" onChange={handleChooseSubtitle_First}/>
                </label>
                <label className='mt-4 inline-block'>
                    Choose Second Subtitle:
                    <input type="file" accept=".srt" onChange={handleChooseSubtitle_Second}/>
                </label>
                <button className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={closeModal}>Apply</button>
            </Modal>
        </>
    );
};

export default App;
