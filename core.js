const basher = (function() {
    const t = {};
    t.tList = [];
    t.go = false;
    t.fighting = false;
    t.class = client.get_variable("my_class")
    t.target = '';

    t.bashables = function() { return client.get_item_list("room", "m", "x") };
    t.get_area_priority = function() {
        const area = client.get_variable('basher area');
        const bashable = client.get_variable('basher ' + area).split(',');
        return bashable;
    };
    t.populate_tList = function() {
        t.tList = [];
        const bashables = t.bashables();
        const prio = t.get_area_priority();
        for (x of prio) {
            for (y of bashables) { t.tList.push(y.id) };
        };
    };

    t.has_mob = function(id) {
        const y = [];
        for (x of t.bashables()) {
            y.push(x.id);
        };
        if (!y.includes(id)) return false;
    };

    t.acquire_target = function() {
        if (t.has_mob(t.target)) return;
        if (!t.has_mob(t.target)) t.target = '';
        if (t.bashables()[0]) t.target = t.bashables()[0].id;
    };

    t.get_worst_sys = function() {

    };

    t.get_hp = function() {
        const hp = client.get_variable('my_hp');
        const hpm = client.get_variable('my_maxhp');
        const hpp = hp/hpm
        if ((hpp < .80) && t.classes[t.class].can_heal()) {
            return t.classes[t.class].heal
        }
    };

    t.fight = function() {
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
        }
    };
}());