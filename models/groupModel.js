const mongoose = require('mongoose');

const { generateNameSlug } = require('../utils/slugify');

const groupSchema = new mongoose.Schema({
  groupId: { type: String, unique: true },
  groupName: {
    type: String,
    enum: ['Passive', 'Active'],
    unique: true,
    required: [true, 'Please choose the group!'],
  },
  groupSlug: {
    type: String,
    index: true,
  },
});

// pre hook
groupSchema.pre('save', async function (next) {
  const group = this;

  if (group.groupName === 'Active') {
    group.groupId = '1';
  } else if (group.groupName === 'Passive') {
    group.groupId = '0';
  }

  next();
});

groupSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('groupName')) {
    this.groupSlug = generateNameSlug(this.groupName);
  }
  next();
});

// indexing
groupSchema.index({ groupSlug: 1 });

const GroupProduct = mongoose.model('GroupProduct', groupSchema);

module.exports = GroupProduct;
