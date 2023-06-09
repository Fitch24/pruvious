import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_meta'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('mid').primary()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('key', 255).notNullable().index()
      table.unique(['user_id', 'key'])
      table.text('value').index()
      table.boolean('json')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
