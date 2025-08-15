import { Shaders, GLSL } from 'gl-react';

// Enhanced vintage filter shaders for 18 specific effects
export const vintageShaders = Shaders.create({
  blueJeans: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      uniform float intensity;
      
      void main() {
        vec4 color = texture2D(texture, uv);
        
        // Cool blue tone mapping
        color.r = color.r * 0.8;
        color.g = color.g * 0.9;
        color.b = color.b * 1.2;
        
        // Fade effect
        color.rgb = color.rgb * 0.9;
        
        // Vignette
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(uv, center);
        float vignette = 1.0 - smoothstep(0.4, 1.0, dist);
        color.rgb *= vignette;
        
        gl_FragColor = mix(texture2D(texture, uv), color, intensity);
      }
    `,
  },
  
  bornToDie: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      uniform float intensity;
      
      void main() {
        vec4 color = texture2D(texture, uv);
        
        // High contrast navy effect
        color.rgb = (color.rgb - 0.5) * 1.4 + 0.5;
        
        // Navy blue tint
        color.r = color.r * 0.6;
        color.g = color.g * 0.7;
        color.b = color.b * 1.1;
        
        // Muted saturation
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        color.rgb = mix(color.rgb, vec3(gray), 0.4);
        
        gl_FragColor = mix(texture2D(texture, uv), color, intensity);
      }
    `,
  },

  westCoast: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      uniform float intensity;
      
      void main() {
        vec4 color = texture2D(texture, uv);
        
        // Golden sunlight effect
        color.r = color.r * 1.2;
        color.g = color.g * 1.1;
        color.b = color.b * 0.8;
        
        // Overexposed highlights
        color.rgb = color.rgb * 1.2;
        color.rgb = min(color.rgb, vec3(1.0));
        
        // Warm glow
        vec3 warm = vec3(1.0, 0.9, 0.7);
        color.rgb = mix(color.rgb, color.rgb * warm, 0.3);
        
        gl_FragColor = mix(texture2D(texture, uv), color, intensity);
      }
    `,
  },

  youngBeautiful: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      uniform float intensity;
      
      void main() {
        vec4 color = texture2D(texture, uv);
        
        // Champagne glow
        color.r = color.r * 1.15;
        color.g = color.g * 1.1;
        color.b = color.b * 0.95;
        
        // Soft blur effect simulation
        vec2 offset = vec2(1.0) / vec2(800.0, 600.0);
        vec4 blur = (
          texture2D(texture, uv + offset) +
          texture2D(texture, uv - offset) +
          texture2D(texture, uv + vec2(offset.x, -offset.y)) +
          texture2D(texture, uv + vec2(-offset.x, offset.y))
        ) * 0.25;
        
        color = mix(color, blur, 0.3);
        
        // Brightness boost
        color.rgb = color.rgb * 1.15;
        
        gl_FragColor = mix(texture2D(texture, uv), color, intensity);
      }
    `,
  },

  summertimeSadness: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      uniform float intensity;
      
      void main() {
        vec4 color = texture2D(texture, uv);
        
        // Warm orange-pink fade
        color.r = color.r * 1.3;
        color.g = color.g * 1.0;
        color.b = color.b * 0.7;
        
        // Pink tint in highlights
        float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        if (luma > 0.5) {
          color.r = color.r * 1.1;
          color.b = color.b * 1.1;
        }
        
        // Fade effect
        color.rgb = mix(color.rgb, vec3(0.9, 0.8, 0.7), 0.2);
        
        gl_FragColor = mix(texture2D(texture, uv), color, intensity);
      }
    `,
  },

  honeymoon: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      uniform float intensity;
      
      void main() {
        vec4 color = texture2D(texture, uv);
        
        // Sepia romantic effect
        float r = color.r * 0.393 + color.g * 0.769 + color.b * 0.189;
        float g = color.r * 0.349 + color.g * 0.686 + color.b * 0.168;
        float b = color.r * 0.272 + color.g * 0.534 + color.b * 0.131;
        
        // Romantic warm tint
        r = r * 1.1;
        g = g * 1.0;
        b = b * 0.8;
        
        // Soft fade
        vec3 sepiaColor = vec3(r, g, b);
        sepiaColor = mix(sepiaColor, vec3(0.95, 0.9, 0.8), 0.15);
        
        gl_FragColor = mix(texture2D(texture, uv), vec4(sepiaColor, color.a), intensity);
      }
    `,
  },

  ride: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      uniform float intensity;
      
      void main() {
        vec4 color = texture2D(texture, uv);
        
        // Desert dusk orange
        color.r = color.r * 1.4;
        color.g = color.g * 1.1;
        color.b = color.b * 0.6;
        
        // Heavy grain simulation
        float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
        color.rgb = mix(color.rgb, vec3(noise), 0.15);
        
        // Contrast boost
        color.rgb = (color.rgb - 0.5) * 1.2 + 0.5;
        
        gl_FragColor = mix(texture2D(texture, uv), color, intensity);
      }
    `,
  },

  love: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      uniform float intensity;
      
      void main() {
        vec4 color = texture2D(texture, uv);
        
        // Pastel haze effect
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        color.rgb = mix(color.rgb, vec3(gray), 0.3);
        
        // Soft pastel tints
        color.r = color.r * 1.1;
        color.g = color.g * 1.05;
        color.b = color.b * 1.15;
        
        // Brightness and softness
        color.rgb = color.rgb * 1.1;
        color.rgb = mix(color.rgb, vec3(0.95), 0.1);
        
        gl_FragColor = mix(texture2D(texture, uv), color, intensity);
      }
    `,
  },

  doinTime: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      uniform float intensity;
      
      void main() {
        vec4 color = texture2D(texture, uv);
        
        // High saturation beach tones
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        color.rgb = mix(vec3(gray), color.rgb, 1.5);
        
        // Beach color enhancement
        color.g = color.g * 1.2; // Enhanced greens
        color.b = color.b * 1.3; // Enhanced blues
        
        // Brightness for beach effect
        color.rgb = color.rgb * 1.1;
        
        gl_FragColor = mix(texture2D(texture, uv), color, intensity);
      }
    `,
  },

  cherry: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      uniform float intensity;
      
      void main() {
        vec4 color = texture2D(texture, uv);
        
        // Deep red highlights
        float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        if (luma > 0.4) {
          color.r = color.r * 1.4;
          color.g = color.g * 0.8;
          color.b = color.b * 0.8;
        }
        
        // Warm shadows
        if (luma < 0.4) {
          color.r = color.r * 1.1;
          color.g = color.g * 0.95;
          color.b = color.b * 0.7;
        }
        
        // Overall contrast
        color.rgb = (color.rgb - 0.5) * 1.2 + 0.5;
        
        gl_FragColor = mix(texture2D(texture, uv), color, intensity);
      }
    `,
  }
});

// Additional utility shaders
export const utilityShaders = Shaders.create({
  vignette: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      uniform float intensity;
      uniform float radius;
      
      void main() {
        vec4 color = texture2D(texture, uv);
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(uv, center);
        float vignette = 1.0 - smoothstep(radius * 0.5, radius, dist);
        
        color.rgb *= mix(1.0, vignette, intensity);
        gl_FragColor = color;
      }
    `,
  },
  
  grain: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      uniform float intensity;
      uniform float time;
      
      void main() {
        vec4 color = texture2D(texture, uv);
        
        // Film grain
        float noise = fract(sin(dot(uv + time, vec2(12.9898, 78.233))) * 43758.5453);
        noise = (noise - 0.5) * intensity;
        
        color.rgb += noise;
        gl_FragColor = color;
      }
    `,
  }
});

export default vintageShaders;
