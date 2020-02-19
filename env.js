module.exports = {

	// Project options.
	projectURL: '',
	productURL: './public',
	browserAutoOpen: true,
	injectChanges: true,

	// Style options.
	styleSRC: './src/assets/scss/style.scss', // Path to main .scss file.
	styleDestination: './public/assets/css/', // Path to place the compiled CSS file. Default set to root folder.
	outputStyle: 'compressed', // Available options → 'compact' or 'compressed' or 'nested' or 'expanded'
	errLogToConsole: true,
	precision: 10,

	whitelistPurgeCss: [
		"active",
		"is-invalid"
	],

	// JS Vendor options.
	jsVendorSRC: './src/assets/js/*.js',
	jsVendorDestination: './public/assets/js/',
	jsVendorFile: 'script',

	// Watch files paths.
	watchStyles: './src/assets/scss/**/*.scss',
	watchJsVendor: './src/assets/js/**/*.js',
	watchDocuments: './public/**/*.html',

	BROWSERS_LIST: [
		'last 2 version',
		'> 1%',
		'ie >= 11',
	]
};
