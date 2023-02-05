export class AudioManager {
    constructor(Babylon, scene){
        this.BABYLON = Babylon;
        this.scene = scene;
        this.pingFX;
        this.softFX;
        this.warmPiano;
    }

loadSounds(){
    this.pingFX = new this.BABYLON.Sound("Ping", "./audio/ping.mp3", this.scene, null, {
        loop: false,
        autoplay: false,
      });

      this.softFX = new this.BABYLON.Sound("snd", "./audio/snd_fragment.mp3", this.scene, null, {
        loop: false,
        autoplay: false,
      });

      this.warmPiano = new this.BABYLON.Sound("WarmPiano", "./audio/warm-piano.mp3", this.scene, null, {
        loop: true,
        autoplay: true,
      });
}

}