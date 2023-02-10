// let RecordRTC = require("./RecordRTC");
cc.Class({
    extends: cc.Component,

    editor: {
    },
    properties: {
        tipsLabel: cc.Label,
        recordingSF: cc.SpriteFrame,
        recordSF: cc.SpriteFrame,
        _isRecording: false,
        videoPlayer: cc.VideoPlayer,
        _recordRTC: null,
    },

    // use this for initialization
    onLoad: function () {
        let self = this;
        self.tipsLabel.string = "loading...";

        var options = {
            type: 'audio',
            numberOfAudioChannels: 1,
            checkForInactiveTracks: false,
            bufferSize: 4096,
            recorderType: StereoAudioRecorder
        };

        let microphone = null;
        this.captureMicrophone((mic) => {
            console.log("获取语音权限", mic)
            microphone = mic;
            this._recordRTC = RecordRTC(microphone, options);
        })

    },

    clickBtn() {
        if (this._recordRTC) {
            this.videoPlayer.stop();
            this._recordRTC.startRecording();
        }
    },

    clickEnd() {
        this._recordRTC.stopRecording((audioVideoWebMURL) => {
            //本地临时录音文件地址
            this.videoPlayer.remoteURL = audioVideoWebMURL;
            this.videoPlayer.play();

            //二进制数据
            let recordedBlob = this._recordRTC.getBlob();

            //base64格式数据
            this._recordRTC.getDataURL((dataURL) => {

            });
        });

    },

    captureMicrophone(callback) {
        console.log("捕获麦克风函数调用")
        // 没有媒体设置告知版本低
        if (typeof navigator.mediaDevices === 'undefined' || !navigator.mediaDevices.getUserMedia) {
            console.log("没有媒体设置告知版本低")
        }
        // 获取设备的录音权限
        navigator.mediaDevices.getUserMedia({
            audio: isEdge ? true : { echoCancellation: false }
        }).then((mic) => {
            console.log("获取麦克风成功回调", mic)
            callback(mic);
        }).catch((error) => {
            console.log("获取麦克风失败回调", error)
        })
    }


});
