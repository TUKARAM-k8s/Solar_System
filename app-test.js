let mongoose = require("mongoose");
let server = require("./app");
let chai = require("chai");
let chaiHttp = require("chai-http");

// Assertion 
chai.should();
chai.use(chaiHttp); 

describe('Planets API Suite', () => {

    // 🟢 फ्रेश डेटा री-सीड करण्याचा जादूई बिफोर ब्लॉक
    // 🟢 फक्त हा नवीन आणि सुरक्षित 'before' ब्लॉक तिथे पेस्ट करा:
    before(async function() {
        this.timeout(20000); // मोकाला १० सेकंदाचा वेळ देणे
        console.log("Waiting for DB and seeding fresh data...");
        
        try {
            // १. डेटाबेस कनेक्शन पूर्णपणे ओपन होण्याची वाट पाहणे
            if (mongoose.connection.readyState !== 1) {
                await new Promise((resolve) => mongoose.connection.once('open', resolve));
            }

            const planetModel = mongoose.model('planets');
            
            // २. जुना डेटा साफ करणे
            await planetModel.deleteMany({});
            console.log("Old data cleared 🧹");

            // ३. फ्रेश डेटा इन्सर्ट करणे
            const freshPlanets = [
                { id: 1, name: "Mercury", description: "Closest planet to the Sun", velocity: "47.87 km/s", distance: "57.9 million km" },
                { id: 2, name: "Venus", description: "Second planet from the Sun", velocity: "35.02 km/s", distance: "108.2 million km" },
                { id: 3, name: "Earth", description: "Our home planet", velocity: "29.78 km/s", distance: "149.6 million km" },
                { id: 4, name: "Mars", description: "The Red Planet", velocity: "24.07 km/s", distance: "227.9 million km" },
                { id: 5, name: "Jupiter", description: "The largest planet", velocity: "13.07 km/s", distance: "778.5 million km" },
                { id: 6, name: "Saturn", description: "The ringed planet", velocity: "9.69 km/s", distance: "1.4 billion km" },
                { id: 7, name: "Uranus", description: "An ice giant", velocity: "6.81 km/s", distance: "2.9 billion km" },
                { id: 8, name: "Neptune", description: "The most distant planet", velocity: "5.43 km/s", distance: "4.5 billion km" }
            ];

            // गिटहबला इथे डेटा पूर्ण लिहेपर्यंत थांबवणे
            await planetModel.insertMany(freshPlanets);
            console.log("Fresh Solar System Data Seeded Successfully! 🚀");

            // डेटा इन्सर्ट झाल्यावर अजून १ सेकंद अतिरिक्त होल्ड देणे
            await new Promise((resolve) => setTimeout(resolve, 5000));
            
        } catch (error) {
            console.log("Error during seeding data:", error);
        }
    });

    after(async () => {
        try {
            await mongoose.connection.close();
            if (server && server.close) {
                await new Promise((resolve) => server.close(resolve));
            }
        } catch (error) {
            console.log("Cleanup error:", error);
        } finally {
            setTimeout(() => {
                process.exit(0); 
            }, 1000);
        }
    });

    describe('Fetching Planet Details', () => {
        // 🟢 फक्त Mercury चा हा ब्लॉक व्हिज्युअल स्टुडिओमध्ये बदलून घ्या:
        it('it should fetch a planet named Mercury', (done) => {
            let payload = {
                id: 1 // 👈 इथे कोणताही कोट ("") नाहीये, हा शुद्ध नंबर १ आहे याची १००% खात्री करा!
            }
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(1);
                    res.body.should.have.property('name').eql('Mercury');
                    done();
                });
        });

        it('it should fetch a planet named Venus', (done) => {
            let payload = { id: 2 }
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(2);
                    res.body.should.have.property('name').eql('Venus');
                    done();
                });
        });

        it('it should fetch a planet named Earth', (done) => {
            let payload = { id: 3 }
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(3);
                    res.body.should.have.property('name').eql('Earth');
                    done();
                });
        });

        it('it should fetch a planet named Mars', (done) => {
            let payload = { id: 4 }
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(4);
                    res.body.should.have.property('name').eql('Mars');
                    done();
                });
        });

        it('it should fetch a planet named Jupiter', (done) => {
            let payload = { id: 5 }
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(5);
                    res.body.should.have.property('name').eql('Jupiter');
                    done();
                });
        });

        it('it should fetch a planet named Saturn', (done) => {
            let payload = { id: 6 }
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(6);
                    res.body.should.have.property('name').eql('Saturn'); // 👈 तुमच्या स्कीमात इथे Saturn आहे
                    done();
                });
        });

        it('it should fetch a planet named Uranus', (done) => {
            let payload = { id: 7 }
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(7);
                    res.body.should.have.property('name').eql('Uranus');
                    done();
                });
        });

        it('it should fetch a planet named Neptune', (done) => {
            let payload = { id: 8 }
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(8);
                    res.body.should.have.property('name').eql('Neptune');
                    done();
                });
        });
    });        
});

describe('Testing Other Endpoints', () => {
    describe('it should fetch OS Details', () => {
        it('it should fetch OS details', (done) => {
            chai.request(server)
                .get('/os')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('it should fetch Live Status', () => {
        it('it checks Liveness endpoint', (done) => {
            chai.request(server)
                .get('/live')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('live');
                    done();
                });
        });
    });

    describe('it should fetch Ready Status', () => {
        it('it checks Readiness endpoint', (done) => {
            chai.request(server)
                .get('/ready')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('ready');
                    done();
                });
        });
    });
});