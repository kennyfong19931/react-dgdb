export function parseColorTag(input, isRemove){
    const regex = /\[([A-Fa-f0-9]{6}|w{3})\]/gm;
    if(regex.exec(input) !== null){
        if(isRemove){
            input = input.replace(/\[([A-Fa-f0-9]{6}|w{3})\]/g, '');
            input = input.replace(/\[\-\]/g, ''); // eslint-disable-line no-useless-escape
        } else {
            input = input.replace(/\[([A-Fa-f0-9]{6}|w{3})\]/g, '<span style="color:#$1">');
            input = input.replace(/\[\-\]/g, '</span>'); // eslint-disable-line no-useless-escape
        }
    }
    return input;
}