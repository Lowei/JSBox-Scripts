// 原作者: https://github.com/LisonFan/JSBox-Script/

main()

function main() {

    $ui.loading('处理中...')

    var douyin_url = $context.link
    if (!douyin_url) {
        douyin_url = $clipboard.link
    }
    
    if (isDouYin(douyin_url) > 0) {
        getDouYinVideoDownloadURL(douyin_url)
    } else {
        $ui.loading(false)
        $ui.alert({
            title: "错误",
            message: "传入的不是抖音的链接",
        })
    }
    $ui.loading(false)
}

function isDouYin(url) {
    var regx = /douyin/g
    return regx.test(url)
}

function getDouYinVideoDownloadURL(url) {
    $http.get({
        url: url,
        handler: function (resp) {
            var data = resp.data
            if (data) {
                var regx = /(?=s_vid\=)[^"]+/gi
                $console.warn(data);
                var douyin_video_id = regx.exec(data)[0].split("\\")[0]
                if (douyin_video_id) {
                    var douyin_video_download_url = "https://aweme.snssdk.com/aweme/v1/play/?" + douyin_video_id
                    var file_name = 'douyin_' + $text.MD5(douyin_video_id).substr(0, 6);
                    // $console.warn(file_name);
                    shareDouYinVideo(douyin_video_download_url, file_name)
                } else {
                    $ui.loading(false)
                    $ui.alert({
                        title: "错误",
                        message: "解析失败",
                    })
                }
            } else {
                $ui.loading(false)
                $ui.alert({
                    title: "错误",
                    message: "数据获取失败",
                })
            }
        }
    })
}

function shareDouYinVideo(url, file_name) {
    $ui.loading('开始下载')
    $http.lengthen({
        url: url,
        handler: function (url) {
            $http.download({
                url: url,
                progress: function (bytesWritten, totalBytes) {
                    var percentage = bytesWritten * 1.0 / totalBytes
                },
                handler: function (resp) {
                    var file = resp.data
                    $ui.loading(false)
                    $share.sheet([file_name + '.mp4', file])
                }
            })
        }
    })
}
