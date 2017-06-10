require('./generate_diagrams.js');

describe("generate_diagrams", function() {
    
    it("Call iterateFolder to generate a diagram", function() {
        iterateFolder( './lib' );
    });

});
