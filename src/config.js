module.exports = {

    colors: {

    },

    commentTypes: [ 'NOTE', 'TODO', 'OPTIMIZE', 'CLARIFY', 'REMOVE', 'LINK', 'WARN' ],

    container: {
        singleLine: {
            begin   : '\\[\\[{TYPE}\\]\\]'
        }
        //  [[TODO]] add multi-line support

    }
};