module.exports = {
    build: {
        env: require('./prod.env'),
        DisableF12: true
    },
    dev: {
        env: require('./dev.env'),
        removeElectronJunk: true,
        chineseLog: false,
        port: 9080
    },
    test: {
        env: require('./test.env'),
        removeElectronJunk: true,
        chineseLog: false,
        port: 9081
    },
    development: require('./dev.env'),
    production: require('./prod.env'),
    test: require('./test.env'),
    UseStartupChart: true,
    IsUseSysTitle: true,
    DllFolder: '',
    BuiltInServerPort: 25565
}
