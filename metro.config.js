module.exports = {
  resolver: {
    blacklistRE: /node_modules\/.*\/node_modules\/.*/,
  },
  watchFolders: [],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
