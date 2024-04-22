import { Model, DataTypes, type InferAttributes, type InferCreationAttributes } from '@sequelize/core';

import { Attribute, NotNull, PrimaryKey } from '@sequelize/core/decorators-legacy';

export class Hash extends Model<InferAttributes<Hash>, InferCreationAttributes<Hash>> {
    @Attribute(DataTypes.STRING)
    @PrimaryKey
    declare command: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare hash: string;
}
