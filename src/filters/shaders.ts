import { Shaders, GLSL } from 'gl-react';

export const vintageFilter = Shaders.create({
  vintage: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      uniform float intensity;
      
      void main() {
        vec4 color = texture2D(texture, uv);
        
        // Sepia effect
        float r = color.r * 0.393 + color.g * 0.769 + color.b * 0.189;
        float g = color.r * 0.349 + color.g * 0.686 + color.b * 0.168;
        float b = color.r * 0.272 + color.g * 0.534 + color.b * 0.131;
        
        // Vintage color grading
        r = r * 1.1;
        g = g * 0.95;
        b = b * 0.8;
        
        // Vignette effect
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(uv, center);
        float vignette = 1.0 - smoothstep(0.3, 0.8, dist);
        
        vec3 finalColor = vec3(r, g, b) * vignette;
        finalColor = mix(color.rgb, finalColor, intensity);
        
        gl_FragColor = vec4(finalColor, color.a);
      }
    `,
  },
});

export const blueFilter = Shaders.create({
  blue: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      uniform float intensity;
      
      void main() {
        vec4 color = texture2D(texture, uv);
        
        // Blue tint
        color.b = color.b * 1.3;
        color.r = color.r * 0.8;
        color.g = color.g * 0.9;
        
        // Contrast adjustment
        color.rgb = (color.rgb - 0.5) * 1.2 + 0.5;
        
        gl_FragColor = mix(texture2D(texture, uv), color, intensity);
      }
    `,
  },
});

export const sepiaFilter = Shaders.create({
  sepia: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      uniform float intensity;
      
      void main() {
        vec4 color = texture2D(texture, uv);
        
        float r = color.r * 0.393 + color.g * 0.769 + color.b * 0.189;
        float g = color.r * 0.349 + color.g * 0.686 + color.b * 0.168;
        float b = color.r * 0.272 + color.g * 0.534 + color.b * 0.131;
        
        vec3 sepiaColor = vec3(r, g, b);
        vec3 finalColor = mix(color.rgb, sepiaColor, intensity);
        
        gl_FragColor = vec4(finalColor, color.a);
      }
    `,
  },
});
