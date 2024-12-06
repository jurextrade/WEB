
class TLVError extends Error {
    constructor(e, a) {
        super(e),
        this.name = "TLVParserError",
        this.parsed = a
    }
}

function *TLVGenerator(e) {
    for (var a of e.match(/.{1,2}/g))
        yield a;
    throw new Error("Not enough data")
}

function TLVNext(a) {
    if (128 & (len = parseInt(a.next().value, 16))) {
        if (2 < (num_of_bytes = 127 & len))
            throw new Error("Lengths of size more than 2 bytes are not supported");
        for (let e = len = 0; e < num_of_bytes; e++)
            len = len << 8 | parseInt(a.next().value, 16)
    }
    return len
}

function TLVTag(e) {
    try {
        tag = parseInt(e.next().value, 16)
    } catch (e) {
        return
    }
    var a = 32 & tag;
    if (31 == (31 & tag) && 
        (tag2 = parseInt(e.next().value, 16),
         tag = (tag << 8) + tag2, 
         128 & tag2) && 
         (tag3 = parseInt(e.next().value, 16),
          tag = (tag << 8) + tag3, 
          128 & tag3))
        throw new Error("Tags of 4+ bytes are not supported");
    return {
        bin: tag,
        str: ((e = (e = tag).toString(16).toUpperCase()).length % 2 != 0 ? "0" : "") + e,
        constructed: a
    }
}

function TLVParse(e) {
    for (var a = [], t = TLVGenerator(e); ; ) {
        try {
            if (void 0 === (tag = TLVTag(t)))
                break;
            if (0 === tag.bin)
                continue
        } catch (e) {
            if (e instanceof TLVError)
                throw e;
            throw new TLVError(e.message,a)
        }
        try {
            if (0 != (len = TLVNext(t))) {
                val = function(a, t) {
                    val = "";
                    for (let e = 0; e < t; e++)
                        val += a.next().value;
                    return val
                }(t, len);
                var n = {
                    tag: tag.str,
                    value: val
                };

                if (tag.constructed)
                    try {
                        n.child = TLVParse(val)
                    } catch (e) {
                        if (e instanceof TLVError)
                            throw n.child = e.parsed,
                            a.push(n),
                            e.parsed = a,
                            e
                    }
                a.push(n)
            }
        } catch (e) {
            if (e instanceof TLVError)
                throw e;
            throw new TLVError("Error during parsing Tag " + tag.str + ": " + e.message,a)
        }
    }
    return a
}
