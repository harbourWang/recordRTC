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
            recorderType: StereoAudioRecorder,
            sampleRate:16000,
            // audio
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

            //
            let file = new File([recordedBlob], this.getFileName('wav'), {
                type: 'audio/wav'
            });
            
            invokeSaveAsDialog(file); // 该方法在recorderRTC.js中已有


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
    },


    getRandomString() {
        if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
            var a = window.crypto.getRandomValues(new Uint32Array(3)),
                token = '';
            for (var i = 0, l = a.length; i < l; i++) {
                token += a[i].toString(36);
            }
            return token;
        } else {
            return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
        }
    },
    // 文件名
    getFileName(fileExtension) {
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth();
        var date = d.getDate();
        return 'RecordRTC-' + year + month + date + '-' + '.' + fileExtension;
    }


});
