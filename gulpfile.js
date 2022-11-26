const gulp = require('gulp');
const fs = require('fs');
const pkg = require('./package.json');

async function defaultTask() {
    try {
        console.log(`Build Version ${pkg.version}`);

        const cjsPkg = pkg;
        pkg.type = 'commonjs';

        fs.writeFileSync('cjs/package.json', JSON.stringify(cjsPkg));

        const esmPkg = pkg;
        pkg.type = 'module';

        fs.writeFileSync('esm/package.json', JSON.stringify(esmPkg));

        return pkg;
    } catch (error) {
        console.debug(error);
    }
}

exports.default = defaultTask