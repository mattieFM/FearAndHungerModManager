module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
	},
	rules: {
		'no-undef': 'off',
		'no-unused-vars': 'off',
		'no-var': 'off',
		'max-len': ['error', { code: 160 }],
		'no-underscore-dangle': 'off',
		'func-names': 'off',
		'no-console': 'off',
		'no-use-before-define': 'off',
		'global-require': 'off',
		'no-plusplus': 'off',
		'vars-on-top': 'off',
		'prefer-destructuring': 'off',
		'prefer-spread': 'off',
		'no-restricted-syntax': 'off',
		'prefer-rest-params': 'off',
		'no-alert': 'off',
		camelcase: 'off',
		'no-useless-concat': 'off',
		'block-scoped-var': 'off',
		'no-redeclare': 'off',
		eqeqeq: 'off',
		'no-param-reassign': 'off',
		'no-fallthrough': 'off',
		'no-eval': 'off',
		'no-restricted-globals': 'off',
		'no-bitwise': 'off',
		'no-mixed-operators': 'off',
		'class-methods-use-this': 'off',
		indent: ['error', 'tab'],
		'no-tabs': 'off',
		'default-case': 'off',
		'linebreak-style': ['error', 'windows'],

	},
	extends: 'airbnb-base',
	overrides: [
		{
			env: {
				node: true,
			},
			files: [
				'.eslintrc.{js,cjs}',
			],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
	},
};
