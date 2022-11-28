THREE.TexturePass = function( texture, opacity ) {

  let screen = 	{

		uniforms: {

			tDiffuse: { type: "t", value: 0, texture: null },
			opacity:  { type: "f", value: 1.0 }

		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = vec2( uv.x, 1.0 - uv.y );",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float opacity;",

			"uniform sampler2D tDiffuse;",

			"varying vec2 vUv;",

			"void main() {",

				"vec4 texel = texture2D( tDiffuse, vUv );",
				"gl_FragColor = opacity * texel;",

			"}"

		].join("\n")

	}
  
	var shader = screen;

	this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	this.uniforms[ "opacity" ].value = ( opacity !== undefined ) ? opacity : 1.0;
	this.uniforms[ "tDiffuse" ].texture = texture;

	this.material = new THREE.ShaderMaterial( {

		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader

	} );

	this.needsSwap = false;

};

THREE.TexturePass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta ) {

		THREE.EffectComposer.quad.materials[ 0 ] = this.material;

		renderer.render( THREE.EffectComposer.scene, THREE.EffectComposer.camera, readBuffer );

	}

};
