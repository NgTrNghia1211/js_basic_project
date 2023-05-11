const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd');
const player = $('.player');
const heading = $('header h2');
const cdThumbnailImage = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeated: false,
    songs: [
        {
            name: 'BB',
            singer: 'Suzu and Rena',
            music: './music/BB-Suzu_Rena-SelectionProject.mp3',
            img: './img/clara.png'
        },
        {
            name: 'Dream Chaser',
            singer: 'YAOSOBI',
            music: './music/DreamChaser-YAOSOBI.mp3',
            img: './img/clara.png'
        },
        {
            name: 'Glorious Day',
            singer: '9 tie',
            music: './music/GloriousDay-9tie-SelectionProject.mp3',
            img: './img/clara.png'
        },
        {
            name: 'Only One Yell',
            singer: '9 tie',
            music: './music/OnlyOneYell-9tie-SelectionProject.mp3',
            img: './img/clara.png'
        },
        {
            name: 'Orange Seven',
            singer: 'Shigatsu Kimi No Uso Opening',
            music: './music/Orange7-Shigatsu.mp3',
            img: './img/clara.png'
        },
        {
            name: 'Orange Seven Ver.Eng',
            singer: 'Shigatsu Kimi No Uso Opening',
            music: './music/Shigatsu-VerEng.mp3',
            img: './img/clara.png'
        },
        {
            name: 'Shokugeki No Soma',
            singer: 'Shokugeki No Soma Opening',
            music: './music/ShokugekiNoSouma.mp3',
            img: './img/clara.png'
        },
        {
            name: 'Tada Koe Hitosu',
            singer: 'Rokudenshi',
            music: './music/TadaKoeHitosu-Rokudenshi.mp3',
            img: './img/clara.png'
        },
        {
            name: 'Tabun',
            singer: 'YAOSOBI',
            music: './music/Tan-YAOSOBI.mp3',
            img: './img/clara.png'
        },
        {
            name: 'Yoru Ni Kakeru',
            singer: 'YAOSOBI',
            music: './music/YoruNiKakeru-YAOSOBI.mp3',
            img: './img/clara.png'
        },
    ],
    render: function () {
        //* test function
        console.log('rendering');

        //* start
        const htmls = this.songs.map(function (song, index) {
            return `
            <div class="song" data-index="${index}">
            <div class="thumb"
                style="background-image: url('${song.img}')">
            </div>
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

        //* because playlist maybe don't have any duplicate so we can 
        //* call it directly
        playList.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvent: function () {
        const cdWidth = cd.offsetWidth;

        // * Process the cd when music is playing
        // * it must circle itself
        const cdThumbAnimation = cdThumbnailImage.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 15000,
            iterations: Infinity
        });

        cdThumbAnimation.pause();

        /* 
            * when scroll the playlist on top or down, 
            * the cd img (size) will change to hide or show it.
        */
        document.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;

            cd.style.width = (cdWidth - scrollTop) > 0 ? (cdWidth - scrollTop) + 'px' : 0;
            cd.style.opacity = (cdWidth - scrollTop) / cdWidth;
        }

        /* 
            * logic when click button play 
            * this is the logic belong to the button play, not the music playing or pausing
        */
        playBtn.onclick = function () {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
                audio.volume = 0.5;
            }
        }

        // * when a music is playing
        audio.onplay = function () {
            player.classList.add('playing');
            app.isPlaying = true;
            cdThumbAnimation.play();
        }
        // * when a music is pausing
        audio.onpause = function () {
            player.classList.remove('playing');
            app.isPlaying = false;
            cdThumbAnimation.pause();
        }

        // * when a duration of music change
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const hasListened = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = hasListened;
            }

        }

        // * when player changing music position (object - progress bar)
        progress.onchange = function (e) {
            const seekTime = e.target.value / 100 * audio.duration;
            audio.currentTime = seekTime;
        }

        // * next song
        // * when change, a next music will be played
        nextBtn.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.nextSong();
            }
            audio.play();
        }


        // * same with prev song
        prevBtn.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.prevSong();
            }
            audio.play();
        }

        // * when click random button
        randomBtn.onclick = function () {
            // * normally, when click random button
            // * the isRandom will be set to true and it operates in the same way when click again
            // * we can use toggle as another way to implement this
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle('active', app.isRandom);
        }

        // * when audio ended a music
        audio.onended = function() {
            // * we can implement as nextBtn
            if (app.isRepeated) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // * when click repeat button
        repeatBtn.onclick = function() {
            app.isRepeated = !app.isRepeated;
            repeatBtn.classList.toggle('active', app.isRepeated);
        };

        // * this is a technique when user click to any thing belong to songs size
        // * the event will active 
        // * but some position the event will not active
        playList.onclick = function(e) {
            // * find elements belong to this class or itself
            const songWillPlay = e.target.closest('.song');
            if (e.target.closest('.song') && !e.target.closest('.option')) {
                app.currentIndex = Number(songWillPlay.dataset.index);
                app.loadCurrentSong();
                audio.play();
            }
        };
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumbnailImage.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.music;
    },
    nextSong: function () {
        if (this.currentIndex < this.songs.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        if (this.currentIndex === 0) {
            this.currentIndex = this.songs.length - 1;
        } else {
            this.currentIndex--;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex = this.currentIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);

        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        //* function to define object attributes
        this.defineProperties();

        //* listen to events (DOM events)
        this.handleEvent();

        //* load current song in UI when app
        this.loadCurrentSong()


        this.render();
    },

}

app.start();



