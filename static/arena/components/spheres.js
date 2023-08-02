import { Group, 
    MathUtils, 
    SphereGeometry, 
    MeshBasicMaterial, 
    Mesh,
    Color,
} from '/static/vendor/three.module.js';

class Spheres extends Group {

    /**
     * Representation of stars in a virtual fly arena
     * 
     * @constructor
     * @param {number} sphereCount - the amount of total spheres surrounding the fly
     * @param {number} sphereRadiusDeg - the radius of the spheres in the starfield in degrees
     * @param {number} shellRadius - the radius of the shell / distance between camera and spheres
     * @param {color} color - color of the spheres (default is green)
     */
    constructor( sphereCount, sphereRadiusDeg, shellRadius, color=0x00ff00 ){
        super();
        this.sphereCount = sphereCount;
        this.sphereRadiusDeg = sphereRadiusDeg;
        this.shellRadius = shellRadius;
        this.color = color;
        this.loggable = null;
        this.lid = 0;
        this.startTime = undefined;
        this.seed = 0;
        this.positions = [];
        this._setup(sphereCount, sphereRadiusDeg, shellRadius, this.seed, this.positions, color);
    }


    /**
     * (private) method to set up the arena with stars
     * @param {number} sphereCount - the amount of total spheres surrounding the fly
     * @param {number} sphereRadiusDeg - the radius of the spheres in the starfield in degrees
     * @param {number} shellRadius - the radius of the shell / distance between camera and spheres
     * @param {number} seed - the seed that was used to generate the location of all points and radius sizes in positions
     * @param {array} positions - 2d array of x, y, and z locations of the spheres as well as the radius size
     * @param {array of colors} color - color of the spheres (default is green)
     */
    _setup( sphereCount, sphereRadiusDeg, shellRadius, seed, positions, color){

        this._log('spheres-sphere-count', sphereCount);
        this._log('spheres-sphere-radius-degrees', sphereRadiusDeg);
        this._log('spheres-shell-radius',shellRadius);
        this._log('spheres-seed', seed)
        this._log('spheres-sphere-color', color);
        this._log('spheres-type', 'SphereGeometry');

        for ( let i=0; i<sphereCount; i++){
            const material = new MeshBasicMaterial( { color: color[i % color.length] } );
            const sphereRadiusRad = MathUtils.degToRad(sphereRadiusDeg[i % sphereRadiusDeg.length])
            const geometry = new SphereGeometry( ((shellRadius*Math.sin(sphereRadiusRad))), 32, 16 );

            const sphereMesh = new Mesh( geometry, material );
            sphereMesh.position.x = positions[i][0];
            sphereMesh.position.y = positions[i][1];
            sphereMesh.position.z = positions[i][2];
            this.add(sphereMesh);
        }

    }


    /**
     * Interface to change the sphere setup
     * @param {number} sphereCount - the amount of total spheres surrounding the fly
     * @param {number} sphereRadiusDeg - the radius of the spheres in the starfield in degrees
     * @param {number} shellRadius - the radius of the shell / distance between camera and spheres
     * @param {number} seed - the seed that was used to generate the location of all points and radius sizes in positions
     * @param {array} positions - 2d array of x, y, and z locations of the spheres as well as the radius size
     * @param {color} color - color of the spheres (default is green)
     */
    changeSpheres(sphereCount, sphereRadiusDeg, shellRadius, seed, positions, color=0x00ff00) {
        this.clear();
        this.setRotationRad(0);
        this._log('spheres-change-clear');
        this._setup(sphereCount, sphereRadiusDeg, shellRadius, seed, positions, color);
    }

    /**
     * Interface to clear the sphere setup
     * Used whenever a non-sphere trial starts
     */
    clearSpheres(){
        this.clear();
        this._log("spheres-clear");
    }

    /**
     * Set the rotational speed of the spheres (in radians)
     * 
     * @param {number} rotateRadHz - rotational speed of the spherical shell in radians per second, 
     * positive is clockwise
     */
    setRotateRadHz(rotateRadHz){
        this.rotateRadHz = rotateRadHz;
        this._log('spheres-set-rotateRadHz', rotateRadHz);
    }

    /**
    * Set the rotational speed of the spherical shell (in degree)
    * 
    * @param {number} rotate_deg_hz - rotational speed of the spheres in degree per second, 
    *      positive is clockwise
    */
    setRotateDegHz(rotate_deg_hz){
        this.rotateRadHz = MathUtils.degToRad(rotate_deg_hz);
        this._log('spheres-set-rotate_deg_hz', rotate_deg_hz);
    }

    /**
     * Set the oscilllation speed in hz and the range of oscillation
     * 
     * @param {number} osc_hz - the speed of the oscillation in hz
     * @param {number} max_deg - the maximum angle of the oscillation
     */
    setOscillation(osc_hz, max_deg){
        if (osc_hz>0){
            this.startTime = Date.now()/1000;
        } else {
            this.startTime = undefined;
        }
        this.osc_hz = osc_hz;
        this.max_deg = MathUtils.degToRad(max_deg);
    }

    /**
     * Rotate the spherical shell to an absolute angle.
     * 
     * @param {number} rotation - set the absolute rotation of the starfield in radians
     */
    setRotationRad(rotation){
        this.rotation.y = rotation % (2*Math.PI);
        this._log('spheres-set-rotationRad', rotation);
    }


    /**
     * Interface to allow arena to be animated.
     * 
     * @param {number} delta - time interval since last tick
     */
    tick(delta){
        if (this.startTime === undefined){ //rotation
            if (this.rotateRadHz){
                this.rotation.y = (this.rotation.y + delta * this.rotateRadHz) % (2*Math.PI);
            }
            this._log('spheres-tick-rotation', this.rotation.y);
        } else { //oscillation
            const c_time = Date.now()/1000;
            this.rotation.y = Math.sin((c_time - this.startTime) * this.osc_hz * (2*Math.PI)) * this.max_deg;
            this._log('spheres-tick-rotation', this.rotation.y);
        }
    }

    /**
     * Set the Loop ID
     * 
     * @param {bigint} lid - Loop ID
     */
    setLid(lid){
        this._log('spheres-set-lid-old', lid);
        this.lid = lid;
    }


    /**
     * (private) Interface to log all parts of the loggable list.
     * 
     * @param {string} key - key of key-value pair to be logged
     * @param {string} value - value of key-value-pair to be logged
     */
    _log(key, value){
        if (this.loggable){
            this.loggable.log(this.lid, key, value);
        }
    }
}

export { Spheres };