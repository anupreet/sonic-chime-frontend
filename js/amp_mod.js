var  PI=Math.PI,
    pi=Math.PI,
    abs=Math.abs,
    sin=Math.sin,
    asin=Math.asin,
    cos=Math.cos,
    tan=Math.tan,
    atan=Math.atan,
    atan2=Math.atan2,
    floor=Math.floor,
    ceil=Math.ceil,
    max=Math.max,
    min=Math.min,
    random=Math.random,
    round=Math.round,
    sqrt=Math.sqrt,
    exp=Math.exp,
    log=Math.log,
    pow=Math.pow;
sampleRate = 44100;
samples_length = 44100;


function mychime() {
    //var samples_length = 44100;               // Plays for 1 second (44.1 KHz)
    var samples = [];
    var frequency = [392, 659.26, 783.99, 1046.5]; // "C4+E4+G4+C5" notes
    for (var i=0; i < samples_length ; i++) { // fills array with samples
        var t = i/samples_length;               // time from 0 to 1
        samples[i] = (sin( frequency[0] * 2*PI*t ) + sin( frequency[1] * 2*PI*t )+ sin( frequency[2] * 2*PI*t ) + + sin( frequency[3] * 2*PI*t ))/4 ;
    }
    return samples;
}

function get_events(){
return [2, 0, 4, 9]
}

function chimes(){
    // Plays for 1 second (44.1 KHz)
    var samples = [];
    //var frequency = [392, 659.26, 783.99, 1046.5]; // "C4+E4+G4+C5" note
    var base_frequency = 392/4  //c4
    // Plays for 1 second (44.1 KHz)
    for (var i=0; i < samples_length ; i++) { // fills array with samples
        var t = i/samples_length;               // time from 0 to 1
        var event_frequency = get_events();
        //samples[i] = (sin( frequency[0] * 2*PI*t ) + sin( frequency[1] * 2*PI*t )+ sin( frequency[2] * 2*PI*t ) + sin( frequency[3] * 2*PI*t ))/4 ;
        samples[i] = (
            sin( event_frequency[0] * base_frequency * 2*PI*t ) +
            sin( event_frequency[1] * base_frequency * 2*PI*t )+
            sin( event_frequency[2] * base_frequency * 2*PI*t ) +
            sin( event_frequency[3] * base_frequency * 2*PI*t )
            )/4 ;
    }
    return samples;
}

function draw_global_chime(samples) {
    normalize_invalid_values(samples); // keep samples between [-1, +1]
    draw_chime(samples);
}

function play_chime(samples){
    var wave = new RIFFWAVE();
    wave.header.sampleRate = sampleRate;
    wave.header.numChannels = 1;
    var audio = new Audio();
    var samples2=convert255(samples);
    wave.Make(samples2);
    audio.src=wave.dataURI;
    setTimeout(function() { audio.play(); }, 10); // page needs time to load?
}


function normalize_invalid_values(samples) {
    for (var i=0, len=samples.length; i<len; i++) {
        if (samples[i]>1) {
            samples[i] = 1;
        } else if (samples[i]<-1) {
            samples[i] = -1;
        }
    }
}

function draw_user_chime(samples){
    // Draw graph
    var canvas = document.getElementById('canvas1');
    var canvas_width = canvas.width;

    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        clearCanvas(context, canvas);
        var amplitude = canvas.height/2-20;
        var iter=0;
        var last_iter_draw=-1;

        var play_duration_ms = samples.length * 1000 / sampleRate; // 44100*1000/44100 = 1000 ms (1 s.)

        var interval_ms = Math.round(canvas_width * play_duration_ms / samples.length); // 882*500/22050 = 20 ms

        var step = 2;
        // 1 = 50 frames per second
        // 2 = 25 frames per second
        // 3 = 15 frames per second
        // 4 = 12 frames per second
        // 5 = 10 frames per second

        // setInterval will run "number_of_iters" times. Will run 25 times (25*20ms = 500 ms = 1/2 s), or 50 times if samples.length=44100
        var number_of_iters = Math.floor(samples.length / canvas_width); // round removing last pixels if samples.length not divisable by canvas.width
        var middle_iter = Math.round(number_of_iters/2);

        var hsl_factor = 50/number_of_iters; // Max fading hsl 's' = 50%

        play_canvas_id = setInterval(function() {
            // Draw graph with a single line (samples in the middle)
            if (iter==middle_iter) { // iter==0 would draw the first samples.
                if (canvas2.getContext) {
                    var context2 = canvas2.getContext('2d');
                    clearCanvas(context2, canvas2);
                    var canvas2_width = canvas2.width;
                    var canvas2_height = canvas2.height;

                    // Draw background graphic grid
                    context2.fillStyle = '#131';
                    context2.fillRect(0, Math.round(canvas2_height/2), canvas2_width, 1);

                    context2.fillStyle = 'hsl(127,83%,66%)'; // green #60f070
                    var x2=0;

                    global.play_canvas2_id = setInterval( function() {
                        var y = Math.round((canvas2_height/2)-samples[x2+middle_iter*canvas_width]*amplitude);
                        context2.fillRect(x2, y, 1, 1);
                        x2++;
                        if (x2>= canvas2_width) {
                            clearInterval(global.play_canvas2_id);
                        }
                    }, 1);
                }
            }

            iter++;
        }, interval_ms); // End of setInterval

    }
}

function draw_chime(samples) {
    // Draw graph
    var canvas = document.getElementById('canvas1');
    var canvas_width = canvas.width;

    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        clearCanvas(context, canvas);
        var amplitude = canvas.height/2-20;
        var iter=0;
        var last_iter_draw=-1;

        var play_duration_ms = samples.length * 1000 / sampleRate; // 44100*1000/44100 = 1000 ms (1 s.)

        var interval_ms = Math.round(canvas_width * play_duration_ms / samples.length); // 882*500/22050 = 20 ms

        var step = 2;
        // 1 = 50 frames per second
        // 2 = 25 frames per second
        // 3 = 15 frames per second
        // 4 = 12 frames per second
        // 5 = 10 frames per second

        // setInterval will run "number_of_iters" times. Will run 25 times (25*20ms = 500 ms = 1/2 s), or 50 times if samples.length=44100
        var number_of_iters = Math.floor(samples.length / canvas_width); // round removing last pixels if samples.length not divisable by canvas.width
        var middle_iter = Math.round(number_of_iters/2);

        var hsl_factor = 50/number_of_iters; // Max fading hsl 's' = 50%

        play_canvas_id = setInterval(function() {
            if (iter%step==0) {

                // Clear last graph
                if (last_iter_draw>=0) {
                    for (var x=0; x<=canvas_width; x++) {
                        var sample_pos = x+((last_iter_draw)*canvas_width);
                        var y = (canvas.height/2)-samples[sample_pos]*amplitude;
                        context.fillStyle = 'hsl(127,13%,'+iter+'%)'; // fading effect
                        last_fillStyle = context.fillStyle;
                        context.fillRect(x, y, 1, 1);
                    }
                }

                var pos_offset = iter*canvas_width;

                if ( pos_offset >= samples.length ) { // is last iter
                    clearInterval(play_canvas_id);
                    context.fillStyle = last_fillStyle;

                } else {
                    context.fillStyle = 'hsl(127,83%,66%)'; // green #60f070
                }
                last_iter_draw = iter;
            }
            iter++;
        }, interval_ms); // End of setInterval

    }

}


//function draw_canvas_graph(samples) {
//    // Draw graph
//    var canvas2 = document.getElementById('canvas2');
//    var canvas = document.getElementById('canvas1');
//    var canvas_width = canvas.width;
//
//    if (canvas.getContext) {
//        var context = canvas.getContext('2d');
//        clearCanvas(context, canvas);
//        var amplitude = canvas.height/2-20;
//        var iter=0;
//        var last_iter_draw=-1;
//
//        var play_duration_ms = samples.length * 1000 / sampleRate; // 44100*1000/44100 = 1000 ms (1 s.)
//
//        var interval_ms = Math.round(canvas_width * play_duration_ms / samples.length); // 882*500/22050 = 20 ms
//
//        var step = 2;
//        // 1 = 50 frames per second
//        // 2 = 25 frames per second
//        // 3 = 15 frames per second
//        // 4 = 12 frames per second
//        // 5 = 10 frames per second
//
//        // setInterval will run "number_of_iters" times. Will run 25 times (25*20ms = 500 ms = 1/2 s), or 50 times if samples.length=44100
//        var number_of_iters = Math.floor(samples.length / canvas_width); // round removing last pixels if samples.length not divisable by canvas.width
//        var middle_iter = Math.round(number_of_iters/2);
//
//        var hsl_factor = 50/number_of_iters; // Max fading hsl 's' = 50%
//
//             play_canvas_id = setInterval(function() {
//
//            // Draw graph with a single line (samples in the middle)
//            if (iter==middle_iter) { // iter==0 would draw the first samples.
//                if (canvas2.getContext) {
//                    var context2 = canvas2.getContext('2d');
//                    clearCanvas(context2, canvas2);
//                    var canvas2_width = canvas2.width;
//                    var canvas2_height = canvas2.height;
//
//                    // Draw background graphic grid
//                    context2.fillStyle = '#131';
//                    context2.fillRect(0, Math.round(canvas2_height/2), canvas2_width, 1);
//
//                    context2.fillStyle = 'hsl(127,83%,66%)'; // green #60f070
//                    var x2=0;
//
//                        play_canvas2_id = setInterval( function() {
//                        var y = Math.round((canvas2_height/2)-samples[x2+middle_iter*canvas_width]*amplitude);
//                        context2.fillRect(x2, y, 1, 1);
//                        x2++;
//                        if (x2>= canvas2_width) {
//                            clearInterval(play_canvas2_id);
//                        }
//                    }, 1);
//                }
//            }
//
//            if (iter%step==0) {
//
//                // Clear last graph
//                if (last_iter_draw>=0) {
//                    for (var x=0; x<=canvas_width; x++) {
//                        var sample_pos = x+((last_iter_draw)*canvas_width);
//                        var y = (canvas.height/2)-samples[sample_pos]*amplitude;
//                        context.fillStyle = 'hsl(127,13%,'+iter+'%)'; // fading effect
//                        last_fillStyle = context.fillStyle;
//                        context.fillRect(x, y, 1, 1);
//                    }
//                }
//
//                var pos_offset = iter*canvas_width;
//
//                if ( pos_offset >= samples.length ) { // is last iter
//                    clearInterval(play_canvas_id);
//                    context.fillStyle = last_fillStyle;
//
//                } else {
//                    context.fillStyle = 'hsl(127,83%,66%)'; // green #60f070
//                }
//                last_iter_draw = iter;
//            }
//            iter++;
//        }, interval_ms); // End of setInterval
//
//    }
//
//}

function clearCanvas(context, canvas) {
    var w = canvas.width;
    context.clearRect(0, 0, w, canvas.height);
    canvas.width = 1;
    canvas.width = w;
    context.fillStyle = '#7f7';
}

function convert255(data) {
    var data_0_255=[];
    for (var i=0;i<data.length;i++) {
        data_0_255[i]=128+Math.round(127*data[i]);
    }
    return data_0_255;
}