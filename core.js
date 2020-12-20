var basher = (function() {
    const t = {};

    t.classes = {
        'Engineer':{
            'heal':function() {return t.getAttack()},
            'attack':function() {return 'bot claw'},
            'can_heal':function() { return true },
            'interrupt':function() {return 'gadget shock'}
        },
        'Fury':{
            'heal': function() {return 'kith suffuse'},
            'can_heal':function() { return true },
            'attack': function() {},
        },
        'BEAST':{
            'heal': function() {return 'suit support'},
            'can_heal':function() { return true },
            'attack': function() {},
        },
        'Scoundrel':{
            'heal': function() {return 'guile stim'},
            'can_heal':function() { return true },
            'attack': function() {},
        },
        'Nanoseer':{
            'heal': function() {return 'nano repair'},
            'can_heal':function() { return true },
            'attack': function() {return 'void freeze'},
        }
    };
    t.tList = [];
    t.go = false;
    t.fighting = false;
    t.class = client.get_variable("my_class")
    t.target = '';

    t.bashables = function() { return client.get_item_list("room", "m", "x") };
    
    t.get_area_priority = function() {
        const area = gmcp.Room.Info.area;
        const areas = {
            'The Ixsei Desert':[
                "a crystal-clawed rock giant",
                "a salt-crusted quartz creeper",
            ]
        }
        return areas[area] || [];
    };

    t.populate_tList = function() {
        t.tList = [];
        const bashables = t.bashables();
        const prio = t.get_area_priority();
        for (x of prio) {
            for (y of bashables) { if (y.text.match(x)) {t.tList.push(y.id)} };
        };
    };

    t.has_mob = function(id) {
        const y = [];
        for (x of t.bashables()) {
            y.push(x.id);
        };
        if (y.includes(id)) return true;
    };

    t.acquire_target = function() {
        if (t.has_mob(t.target)) return;
        if (!t.has_mob(t.target)) t.target = '';
        if (t.bashables()[0]) t.target = t.bashables()[0].id;
        client.send_direct('st ' + t.target); 
    };

    t.get_worst_sys = function() {
        const systems = ["wetwiring", "muscular", "internal", "mind", "sensory"]
        for (sys of systems) {
            const s = gmcp.Char.Vitals.systems[sys]
            if ((s.health < 92.5) && (s.efficacy == 100) && (gmcp.Char.Vitals.ww == "1")) {
                return sys
            }
        }
    };

    t.get_hp = function() {
        const hp = client.get_variable('my_hp');
        const hpm = client.get_variable('my_maxhp');
        const hpp = hp/hpm
        if ((hpp < .80) && t.classes[t.class].can_heal()) {
            return t.classes[t.class].heal()
        }
    };

    t.getAttack = function() {
        return t.classes[t.class].attack()
    }
    
    t.getInterrupt = function() {
        return t.classes[t.class].interrupt()
    }

    t.fight = function() {
        t.acquire_target();
        if (t.target != '') {
            const needsMend = t.get_worst_sys();
            const needsHeal = t.get_hp();
            t.fighting = true;
            if (t.interrupting) {
                client.send_direct(t.getInterrupt());
            } else if (needsMend) {
                client.send_direct('ww mend ' + needsMend);
            } else if (needsHeal) {
                client.send_direct(needsHeal);
            } else {
                client.send_direct(t.getAttack());
            }
        } else {
            t.acquire_target();
            t.fight();
        }
    };
    return t
}());