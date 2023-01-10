const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
const db = new JsonDatabase({ databasePath:"./databases/myJsonBotConfig.json" });
const dbB = new JsonDatabase({ databasePath:"./databases/myJsonBotConfig.json" });

module.exports = {
    name: "configbot", 
    run: async(client, message, args) => {
      if(message.author.id !== `${perms.get(`${message.author.id}_id`)}`) return message.reply(`❌ | **Você não está na lista de pessoas!**`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
       
      const chave = args[0];
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('logsvendas')
            .setEmoji('🔁')
            .setLabel('Logs Vendas')
            .setStyle('SECONDARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('catecarrinho')
            .setEmoji('🔁')
            .setLabel('Categoria Carrinho')
            .setStyle('SECONDARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('setbanner')
            .setEmoji('🔁')
            .setLabel('Banner')
            .setStyle('SECONDARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('setfoto')
            .setEmoji('🔁')
            .setLabel('Foto')
            .setStyle('SECONDARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('relchave')
            .setEmoji('🔁')
            .setLabel('Atualizar')
            .setStyle('SECONDARY'),
        );
        
        const msg = await message.reply({ embeds: [new Discord.MessageEmbed()
          .setTitle(`Bot Store | Configurando os canais`)
          .setDescription(`
<:ticketlog:1046089466625937509> | **Logs Vendas:** <#${db.get(`logs`)}>
<:Carrinho_WJ:1046088300290658394> | **Categoria do carrinho:** <#${db.get(`catecarrinho`)}>
<:picture:1038561665039487116> | **Banner:**  [Link](${db.get(`banner`)})
<:picture:1038561665039487116> | **Foto:** [Link](${db.get(`foto`)})`)
          .setThumbnail(client.user.displayAvatarURL())
          .setColor(`${db.get(`cor`)}`)], components: [row]})
        const interação = msg.createMessageComponentCollector({ componentType: "BUTTON", })
        interação.on("collect", async (interaction) => {
         if (message.author.id != interaction.user.id) {
          return;
         }
                
         if (interaction.customId === "delchave") {
           msg.delete()
           msg.channel.send("✅ | Excluido!")
           db.delete(`${chave}`)
         }
         if (interaction.customId === "logsvendas") {
             interaction.deferUpdate();
             msg.channel.send("❓ | Qual o canal de logs vendas ?(mande o id)").then(msg => {
               const filter = m => m.author.id === interaction.user.id;
               const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", message => {
                 message.delete()
                 if (isNaN(message.content)) return msg.edit("❌ | Não coloque nenhum caractere especial além de números.")
                 db.set(`logs`, `${message.content}`)
                 msg.edit("✅ | Alterado!")
             })
           })
         }
         if (interaction.customId === "catecarrinho") {
          interaction.deferUpdate();
          msg.channel.send("❓ | Qual o canal de categoria do carrinho ?(mande o id) ?").then(msg => {
            const filter = m => m.author.id === interaction.user.id;
            const collector = msg.channel.createMessageCollector({ filter, max: 1 });
            collector.on("collect", message => {
              message.delete()
              db.set(`catecarrinho`, `${message.content}`)
              msg.edit("✅ | Alterado!")
          })
        })
      }
         if (interaction.customId === "setbanner") {
             interaction.deferUpdate();
             msg.channel.send("❓ | Qual o banner ").then(msg => {
               const filter = m => m.author.id === interaction.user.id;
               const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", message => {
                 message.delete()
                 db.set(`banner`, `${message.content}`)
                 msg.edit("✅ | Alterado!")
             })
           })
         }
         if (interaction.customId === 'setfoto') {
             interaction.deferUpdate();
             msg.channel.send("❓ | Qual a foto do bot?").then(msg => {
               const filter = m => m.author.id === interaction.user.id;
               const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", message => {
                 message.delete()
                 db.set(`foto`, `${message.content}`)
                 msg.edit("✅ | Alterado!")
             })
           })
         }
         if (interaction.customId === 'relchave') {
           interaction.deferUpdate();
           const embed = new Discord.MessageEmbed()
           .setTitle(`Bot Store | Configurando o BOT`)
             .setDescription(`
<:ticketlog:1046089466625937509> | **Logs Vendas:** <#${db.get(`logs`)}>
<:Carrinho_WJ:1046088300290658394> | **Categoria do carrinho:** <#${db.get(`catecarrinho`)}>
<:picture:1038561665039487116> | **Banner:**  [Link](${db.get(`banner`)})
<:picture:1038561665039487116> | **Foto:** [Link](${db.get(`foto`)})`)
             .setThumbnail(client.user.displayAvatarURL())
             .setColor(`${db.get(`cor`)}`)
           msg.edit({ embeds: [embed] })
           message.channel.send("✅ | Atualizado!")
             }
           })
         }
       }