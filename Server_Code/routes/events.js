require('./mongo_connect.js');

exports.findAll = function(callback) {
    db.collection('events', function(err, collection) {
        collection.find().toArray(function(err, items) {
            if(err){
                callback(err, items);
            } else {
                callback(null, items);
            }
        });
    });
};

// 'from'       -- start Date
// 'to'         -- end Date
// 'who'        -- CardHolder for whom this Event concerns
// 'rfid'       -- RFID tag for which this event concerns
// 'dev'        -- Lock at which this Event occurred (name or hostname)
//
// TODO: rename 'rfid' to 'tag'? 'tag' seems more versatile, and it's also shorter!
exports.findWithParams = function(params,done) {
    console.log(params)
    db.collection('events', function(err, collection) {
        var esc = new RegExp(/([.\^$*+?()[{\\|\-\]])/g)

        if(!collection) return done(err,[])
        // Build query -- Is this all OKAY? test this with Mocha damnit!
        var q = []
        if("from" in params && params.from instanceof Date)
          q.push({entryTime: {$gte: params.from}})
        if("to" in params && params.to instanceof Date)
          q.push({entryTime: {$lte: params.to}})
        if("who" in params && params.who.length) {
            // simulate SQL 'LIKE' in a really stupid way
            params.who = params.who.replace(/[^a-zA-Z0-9]+/,'.*').replace(/\s+/,'\s*')
            q.push({cardHolder: {$regex: '.*'+params.who+'.*', $options: 'i' }})
        }
        if("dev" in params && params.dev.length) {
            console.log('Before regex: "' + params.dev + '"')
            var match = params.dev.replace(esc,"\\$1")
            //exactMatch = params.dev.replace(/\//,'\\/').replace(/\./,'\\.')
            //params.dev = exactMatch.replace(/[,\-\[\](){}!@#$%\^&*)]+/g,'.*')
            // Ugh this is horrible :(
            q.push({$or: [
                {hostname: {$regex: '.*'+match+'.*', $options: 'i'}},
                {device: {$regex: '.*'+match+'.*', $options: 'i'}}
            ]})
        }
        if("rfid" in params && params.rfid.length) {
            // Just make it an exact match.
            var match = params.rfid.replace(esc,"\\$1")
            q.push({rfid: {$regex: '.*'+match+'.*'}})
        }
        if(q.length > 1) q = { $and: q }
        else if(q.length > 0) q = q[0]
        else q = {}
        collection.find(q).toArray(function(err, items) {
            // Do we need to filter this more for pagination?
            // Can we even do this efficiently in this case?
            // Whatever, for now don't even bother...
            if(err) done(err, items)
            else done(null, items)
        })
    })
}

exports.findById = function(id, done) {
    var err,  o_id = new BSON.ObjectID.createFromHexString(id.toString());
    console.log('/event/:id findById: ' + id);
    db.collection('events', function(err, collection) {
        collection.find({'_id': o_id}).toArray(function(err, items) {
            if(!err){
                return done(null, items);
            } else{ 
                return done(err, items);
            }
        });
    });
};

exports.add = function(req, done){
    var err;
    console.log('/event add ' + req);

    newEvent = {'device_id': req.body.device_id, 
    'rfid_id': req.body.rfid_id, 
    'alias': req.body.alias, 
    'entry_time': req.body.entry_time, 
    'status': req.body.status};

    db.collection('events', function(err, collection){
        collection.insert(newEvent, {safe:true},function(err, doc){
            if(!err){
                done(null, doc);
            } else {
                done(err, doc);
            }
        });
    });
};

exports.edit = function(req, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('/event/:id edit ' + req);

    event = findById(req.body.id);

    db.collection('events', function(err, collection){
        collection.update({'_id': o_id},
        {
            $set: {'device_id': req.body.device_id, 
                'rfid_id': req.body.rfid_id, 
                'alias': req.body.alias, 
                'entry_time': req.body.entry_time, 
                'status': req.body.status}
        });
    });
};

exports.delete = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('event delete ' + id);

    db.collection('events', function(err, collection){
        collection.delete({'_id': o_id});
    });
};
