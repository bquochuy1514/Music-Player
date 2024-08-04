const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'Huy_Music_Player' 


// const songs = [
//     {
//         name: 'Phía sau một cô gái',
//         singer: 'Soobin Hoàng Sơn',
//         // path: 'https://zingmp3.vn/album/Phia-Sau-Mot-Co-Gai-SOOBIN/ZOUUDAUA.html',
//         path: 'https://open.spotify.com/track/6kCU6i8iRrAAmJJ8Sj4JYC?si=84f1c8fbb5cd4219',
//         image: './assets/img/1cogai.jpg',
//     },
//     {
//         name: 'Nắng có mang em về',
//         singer: 'Huy Quoc Bui',
//         path: 'https://open.spotify.com/track/6kCU6i8iRrAAmJJ8Sj4JYC?si=84f1c8fbb5cd4219',
//         image: 'https://th.bing.com/th/id/OIP.qDSpwRThW1vR8rxbI_QfRQAAAA?rs=1&pid=ImgDetMain',
//     }
// ]

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const volume = $('#volume')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Phía sau một cô gái',
            singer: 'Soobin Hoàng Sơn',
            path: './assets/music/PhiaSauMotCoGai-SoobinHoangSon-4632323.mp3',
            image: './assets/img/1cogai.jpg',
        },
        {
            name: 'Nắng có mang em về',
            singer: 'Shartnuss',
            path: './assets/music/NangCoMangEmVe-VA-14302569.mp3',
            image: 'https://th.bing.com/th/id/OIP.qDSpwRThW1vR8rxbI_QfRQAAAA?rs=1&pid=ImgDetMain',
        },
        {
            name: 'Vừa hận vừa yêu',
            singer: 'Trung Tự',
            path: './assets/music/VuaHanVuaYeu-TrungTu-15121915.mp3',
            image: './assets/img/vuahanvuayeu.jpg'
        },
        {
            name: 'Chìm soul - Obito(remake)',
            singer: 'Obito',
            path: './assets/music/ChimSoulObitoRemake-MCKTrungTran-14279085.mp3',
            image: './assets/img/chimsoul.jpg'
        },
        {
            name: 'Monster',
            singer: 'Katie Sky',
            path: 'https://ia801808.us.archive.org/11/items/MonstersKatieSky/Katie%20Sky%20-%20Monsters%20%28Official%20AudioOut%20Now%20at%20iTunes%29.mp3',
            image: 'https://f4.bcbits.com/img/a4231063555_10.jpg'
        },
        {
            name: 'Đừng như thói quen',
            singer: 'Jaykii - Kỳ Duyên',
            path: './assets/music/DungNhuThoiQuen.mp3',
            image: 'https://nhaccuthienphuc.com/wp-content/uploads/2018/05/sheet-nhac-dung-nhu-thoi-quen.jpg'
        },
        {
            name: 'Ngày em đẹp nhất',
            singer: 'Tama',
            path: './assets/music/NgayEmDepNhatPianoVersion-TamaVietNam-14805205.mp3',
            image: './assets/img/ngayemdepnhat.jpg'
        },
        {
            name: 'Ngày em đẹp nhất',
            singer: 'Tama',
            path: './assets/music/NgayEmDepNhatPianoVersion-TamaVietNam-14805205.mp3',
            image: './assets/img/ngayemdepnhat.jpg'
        },
        {
            name: 'Ngày em đẹp nhất',
            singer: 'Tama',
            path: './assets/music/NgayEmDepNhatPianoVersion-TamaVietNam-14805205.mp3',
            image: './assets/img/ngayemdepnhat.jpg'
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? "active" : ""}" data-index = "${index}">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>   
            `
        })
        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        //Xử lí CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //Xử lí phóng to / thu nhỏ cd thumb
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //Xử lí khi click nút Play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause() 
            } 
            else {
                audio.play()
            }
        }

        //Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //Khi song bị pause
        audio.onpause = function() {
            player.classList.remove('playing')
            _this.isPlaying = false
            cdThumbAnimate.pause()
        }

        //Khi tiến độ bài hát thay đổi (thay đổi vị trí cục đỏ ở thanh progress)
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        //Xử lí khi tua song
        progress.oninput = function(e) {
            const seekTime = audio.duration * e.target.value / 100;
            audio.currentTime = seekTime
        }

        //Khi next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Khi prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Xử lí bật / tắt random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //Xử lí next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            }
            else {
                nextBtn.click()
            }
        }

        //Xử lí lặp lại một song
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            optionNode = e.target.closest('.option i')
            if(songNode || optionNode) {
                //Xử lí khi click vào song
                if(songNode) {
                    _this.currentIndex = Number(songNode.getAttribute('data-index'))
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                //Xử lí khi click vào option
                else {

                }
            }
        }

        volume.oninput = function() {
            audio.volume = volume.value / 100;
            app.setConfig('currentVolume', audio.volume);
        }
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex <= 0) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    scrollToActiveSong: function() {
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: "smooth", block: "end", inline: "nearest"
            })
        }, 200)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    start: function() {
        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        //Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        //Lắng nghe, xử lý các sự kiện
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên vào UI(User Interface) khi chạy ứng dụng
        this.loadCurrentSong()

        //Render playlist
        this.render()

        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    },
}

app.start()














