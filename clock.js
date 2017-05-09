document.body.appendChild(canvas);

function initShaders () {

    let vertexShader = new Shader(gl, "vertex");
    let fragmentShader = new Shader(gl, "frag");

    program = gl.createProgram();
    gl.attachShader(program, vertexShader.id);
    gl.attachShader(program, fragmentShader.id);
    gl.linkProgram(program);

    //Se o shader falhar, cria um alerta.
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
       alert("Não foi possivel inicializar o shader do programa.");
    } else {
       //usa o programa
         gl.useProgram(program);
         program.vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
         gl.enableVertexAttribArray(program.vertexPositionAttribute);

         program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
         program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
    }
}

function Shader(tipo, identificador){
  this.id = (function()
  {
    let fonte = document.getElementById(identificador);
    let tipo;
    if(fonte.type == "x-vertex/x-shader"){
      tipo = gl.VERTEX_SHADER;
    }else{
      tipo = gl.FRAGMENT_SHADER;
    }
    let i = gl.createShader(tipo);
    gl.shaderSource(i,fonte.innerHTML);
    gl.compileShader(i);

    return i;
  })();
}

let gl, program;

function initGL(canvas) {
  try {
      gl = canvas.getContext("webgl");
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
  } catch (e) {
  }
  if (!gl) {
      alert("Não foi possivel inicializar o WebGl, sorry :-(");
  }
}

let mvMatrix = mat4.create();
let pMatrix = mat4.create();

function setMatrixUniforms() {
  gl.uniformMatrix4fv(program.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(program.mvMatrixUniform, false, mvMatrix);
}

let circleVertexPositionBuffer;
let squareVertexPositionBuffer;
let markHVertexPositionBuffer;
let markMVertexPositionBuffer;
let hourHandVertexPositionBuffer;
let minHandVertexPositionBuffer;
let secHandVertexPositionBuffer;

function initBuffers() {

    initCircBuffer();
    initHMarksBuffer();
    initMMarksBuffer();
    initHourHandBuffer();
    initMinHanBuffer();
    initSecHandBuffer();
}

function initHourHandBuffer(){
    hourHandVertexPositionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, hourHandVertexPositionBuffer);

    let vertexCount = 100;
    let radius = 2.7;
    let angle = (Math.PI * 2) / 12;

    let marks = [0, 0,
                (radius-1.5) * Math.cos(angle), (radius-1.5) * Math.sin(angle)];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(marks), gl.STATIC_DRAW);
    hourHandVertexPositionBuffer.itemSize = 2;
    hourHandVertexPositionBuffer.numItems = 2;
}

function initMinHanBuffer(){
    minHandVertexPositionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, minHandVertexPositionBuffer);

    let vertexCount = 100;
    let radius = 2.7;
    let angle = 11 * ((Math.PI) / 7);

    let marks = [0, 0,
                (radius-0.9) * Math.cos(angle), (radius-0.9) * Math.sin(angle)];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(marks), gl.STATIC_DRAW);
    minHandVertexPositionBuffer.itemSize = 2;
    minHandVertexPositionBuffer.numItems = 2;
}

function initSecHandBuffer(){
  secHandVertexPositionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, secHandVertexPositionBuffer);

  let vertexCount = 100;
  let radius = 2.7;
  let angle = Math.PI;

  let marks = [0, 0,
              (radius-0.5) * Math.cos(angle), (radius-0.5) * Math.sin(angle)];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(marks), gl.STATIC_DRAW);
  secHandVertexPositionBuffer.itemSize = 2;
  secHandVertexPositionBuffer.numItems = 2;

}

function initHMarksBuffer(){
    markHVertexPositionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, markHVertexPositionBuffer);

    let marks = [];
    let lul = [];
    let vertexCount = 24;
    let angle;
    let radius = 2.7;

    for (let i = 0; i < 12; i++)
    {
      angle = i/12 * (Math.PI * 2);

      marks.push((radius-0.1) * Math.cos(angle),
                 (radius-0.1) * Math.sin(angle));
      marks.push((radius-0.4) * Math.cos(angle),
                (radius-0.4) * Math.sin(angle));
    }
    marks.push(marks[0]);
    marks.push(marks[1]);
    vertexCount++;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(marks), gl.STATIC_DRAW);
    markHVertexPositionBuffer.itemSize = 2;
    markHVertexPositionBuffer.numItems = 24;

}

function initMMarksBuffer(){
    markMVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, markMVertexPositionBuffer);

    let marksM = [];
    let vertexCount = 100;
    let angle;
    let radius = 2.7;

    for (let j = 0; j < 60; j++)
    {
      angle = j/60 * (Math.PI * 2);
      /*if(j == 0  || j == 5  || j == 10 || j == 15 || j == 20 ||
         j == 25 || j == 30 || j == 35 || j == 40 || j == 45 ||
         j == 50 || j == 55) continue;*/


         marksM.push((radius-0.1) * Math.cos(angle),
                    (radius-0.1) * Math.sin(angle));
         marksM.push((radius-0.2) * Math.cos(angle),
                   (radius-0.2) * Math.sin(angle));
    }
    marksM.push(marksM[0]);
    marksM.push(marksM[1]);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(marksM), gl.STATIC_DRAW);
    markMVertexPositionBuffer.itemSize = 2;
    markMVertexPositionBuffer.numItems = 120;

}

function initCircBuffer(){
  circleVertexPositionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexPositionBuffer);
  let vertices = [];
  let marks = [];
  let vertexCount = 100;
  let radius = 2.7;

  for (let i = 0; i < vertexCount; i++)
  {
      vertices.push(radius * Math.cos((i / vertexCount) * 2.0 * Math.PI));
      vertices.push(radius * Math.sin((i / vertexCount) * 2.0 * Math.PI));
  }
  vertices.push(vertices[0]);
  vertices.push(vertices[1]);

  vertexCount += 1;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  circleVertexPositionBuffer.itemSize = 2;
  circleVertexPositionBuffer.numItems = vertexCount;

}

function drawScene() {

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    /* ------  Desenha o Circulo ------ */
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0.0, 0.0, -7.0]);
    mat4.scale(mvMatrix, [1.0, 1.0, 1.0]);

    /* ------  Desenha o Circulo ------ */
    gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, circleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.LINE_STRIP, 0, circleVertexPositionBuffer.numItems);

    /* ------  Desenha as marcas das horas ------ */
    gl.bindBuffer(gl.ARRAY_BUFFER, markHVertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, markHVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.LINES, 0, markHVertexPositionBuffer.numItems);

    /* ------  Desenha as marcas dos minutos ------ */
    gl.bindBuffer(gl.ARRAY_BUFFER, markMVertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, markMVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.LINES, 0, markMVertexPositionBuffer.numItems);

    /* ------  Desenha o ponteiro das horas ------ */
    gl.bindBuffer(gl.ARRAY_BUFFER, hourHandVertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, hourHandVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.LINES, 0, hourHandVertexPositionBuffer.numItems);

    /* ------  Desenha o ponteiro dos minutos ------ */
    gl.bindBuffer(gl.ARRAY_BUFFER, minHandVertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, minHandVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.LINES, 0, minHandVertexPositionBuffer.numItems);

    /* ------  Desenha o ponteiro dos segundos ------ */
    gl.bindBuffer(gl.ARRAY_BUFFER, secHandVertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, secHandVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.LINES, 0, secHandVertexPositionBuffer.numItems);

}

function webGLStart() {
  initGL(canvas);
  initShaders();
  initBuffers();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  drawScene();
}

webGLStart();
