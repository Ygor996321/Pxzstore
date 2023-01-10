const Discord = require("discord.js");
const client = new Discord.Client({ intents: 32767 });
const config = require("./config.json");
const mercadopago = require("mercadopago")
const { WebhookClient } = require("discord.js")
const db = require("quick.db")
const axios = require("axios")
const { JsonDatabase, } = require("wio.db");
const dbc = new JsonDatabase({ databasePath:"./databases/myJsonCupons.json" });
const { joinVoiceChannel } = require('@discordjs/voice');
const dbB = new JsonDatabase({ databasePath:"./databases/myJsonBotConfig.json" });


const db2 = new JsonDatabase({
  databasePath:"./databases/myJsonDatabase.json"
});
const moment = require("moment")



moment.locale("pt-br");
client.login(config.TOKEN);

client.once('ready', async () => {

    console.log("✅ - Estou online!")

})

client.on("ready", () => {

    let channel = client.channels.cache.get(config.canalvoz);

    joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    })

    console.log("✅ - Entrei no canal de vóz [" + channel.name + "] com sucesso.")
});

client.on("ready", () => {
    let activities = [
        `que venha o hexa `, `reiTFM#0001`, `olhe minha bio`
      ],
      i = 0;
    setInterval( () => client.user.setActivity(`${activities[i++ % activities.length]}`, {
        type: "STREAMING",
        url: "https://www.twitch.tv/discord"
        }), 30000); // Aqui e o tempo de troca de status, esta e mili segundos 
    client.user
        .setStatus("dnd")
  });

  
process.on('multipleResolves', (type, reason, promise) => {
    console.log(`🚫 Erro Detectado\n\n` + type, promise, reason)
});
process.on('unhandRejection', (reason, promise) => {
    console.log(`🚫 Erro Detectado:\n\n` + reason, promise)
});
process.on('uncaughtException', (error, origin) => {
    console.log(`🚫 Erro Detectado:\n\n` + error, origin)
});
process.on('uncaughtExceptionMonitor', (error, origin) => {
    console.log(`🚫 Erro Detectado:\n\n` + error, origin)
});



client.on('messageCreate', message => {
    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;
    if (!message.content.toLowerCase().startsWith(config.prefix.toLowerCase())) return;
    if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;

    const args = message.content
        .trim().slice(config.prefix.length)
        .split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
        const commandFile = require(`./commands/${command}.js`)
        commandFile.run(client, message, args);
    } catch (err) {
        console.log(err);
    }
});


client.on("interactionCreate", (interaction) => {
    if (interaction.isButton()) {

        const eprod = db.get(interaction.customId);
        if (!eprod) return;
        const severi = interaction.customId;
        if (eprod) {
            const quantidade = db.get(`${severi}.conta`).length;



            const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(interaction.customId)
                        .setLabel('Comprar')
                       .setEmoji('<:blast_carrinho:1024351159332393031>')
                        .setStyle('SUCCESS'),
                );
            const embed = new Discord.MessageEmbed()
                .setTitle(`${dbB.get(`nomebot`)} | Produto`)
                .setDescription(`\`\`\`${db.get(`${interaction.customId}.desc`)}\`\`\`\n <a:planeta:1046086073941508206>| **Nome:** **__${db.get(`${interaction.customId}.nome`)}__**\n<:DinheiroPS:1046086385716695061>| **Preço:** **__R$${db.get(`${interaction.customId}.preco`)}__**\n<:caixa:1046085936674504755> | **Estoque:** **__${db.get(`${interaction.customId}.conta`).length}__**`)
                .setColor(`${dbB.get(`cor`)}`)
                .setFooter("Para comprar clique no botão abaixo.")
                .setThumbnail(`${dbB.get(`foto`)}`)
                .setImage(`${dbB.get(`banner`)}`)
            interaction.message.edit({ embeds: [embed], components: [row] })


            const embedsemstock = new Discord.MessageEmbed()
                .setDescription(`**<a:1015437976781725766:1041646218251599873>| Estamos sem estoque no momento, volte mais tarde**`)
                .setColor(`${dbB.get(`cor`)}`)
            if (quantidade < 1) return interaction.reply({
                embeds: [embedsemstock],
                ephemeral: true
            });

            
const canal = "🛒・carrinho-" + interaction.user.username.toLowerCase().replace("-","").replace("!","").replace("<","").replace("/","").replace(">","");
interaction.deferUpdate()
if ((interaction.guild.channels.cache.find(c => c.name.toLowerCase() === canal))) {
  return;
}

            interaction.guild.channels.create(`🛒・carrinho- ${interaction.user.username}`, {
                type: "GUILD_TEXT",
                parent: `${dbB.get(`catecarrinho`)}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS"]
                    },
                    {
                        id: interaction.user.id,
                        allow: ["VIEW_CHANNEL"],
                        deny: ["SEND_MESSAGES"]
                    }
                ]
            }).then(c => {
                interaction.reply({embeds: [], ephemeral: true})
                const timer1 = setTimeout(function () {
                    
                    c.delete()
                }, 300000)
                c.setTopic(interaction.user.id)
                const emessage = c.send({ content: `<@${interaction.user.id}>` }).then(msg => {
                    setTimeout(() => msg.delete(), 1000)
                })

                const row2 = new Discord.MessageActionRow()
               .addComponents(
                   new Discord.MessageButton()
                       .setCustomId('pix')
                       .setLabel("Aceitar")
                       .setEmoji("<a:certo1:1014994068616527972>")
                       .setStyle("SUCCESS"),
               )
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('cancelar')
                        .setLabel("Recusar")
                        .setStyle("DANGER")
                        .setEmoji("<a:errado1:1014994101747339314>"),
                );
                const embed2 = new Discord.MessageEmbed()
                .setTitle(`${dbB.get(`nomebot`)} | Termos`)
                .setThumbnail(`${dbB.get(`foto`)}`)
                .setImage(`${dbB.get(`banner`)}`)
                .setDescription(`<a:1015437976781725766:1041646218251599873> ***Antes de continuar com sua compra, lembre-se de ler nossos termos!*** \n\n\ **Termos: <#${dbB.get(`canaltermos`)}>** \n\n\ **Use <a:certo1:1014994068616527972> - Para Aceitar e continuar com sua compra** \n **Use <a:errado1:1014994101747339314> - Para Cancelar a compra** `)
                .setColor(`${dbB.get(`cor`)}`)
                .setFooter(`${dbB.get(`nomebot`)} | Todos os Direitos Reservados`)
            c.send({ embeds: [embed2], components: [row2] }).then(msg => {
                const filter = i => i.user.id === interaction.user.id;
                const collector = msg.channel.createMessageComponentCollector({ filter });
                collector.on("collect", interaction2 => {
                
                
                        if (interaction2.customId == 'pix') {
                            clearInterval(timer1)
                            const timer2 = setTimeout(function () {
                    
                                c.delete()
                            }, 300000)
                            msg.delete()
                            let quantidade1 = 1;
                            let precoalt = eprod.preco;
                            const row = new Discord.MessageActionRow()
                                   .addComponents(
                                    new Discord.MessageButton()
                                        .setCustomId('addcboton')
                                        .setLabel("Cupom")
                                        .setEmoji('<:zz_ficha_cdw:1015715215641419886>')
                                        .setStyle("PRIMARY"),
                                )
                                .addComponents(
                                    new Discord.MessageButton()
                                        .setCustomId('comprarboton')
                                        .setLabel("Comprar")
                                        .setEmoji('<a:black_simverificado_B13:1011650417295376497>')
                                        .setStyle("SUCCESS"),
                                )
                                .addComponents(
                                    new Discord.MessageButton()
                                        .setCustomId('cancelar')
                                        .setLabel("Cancelar")
                                        .setEmoji('<a:black_naoverificado_B13:1011652393332658176>')
                                        .setStyle("DANGER"),
                                )
                                .addComponents(
                                    new Discord.MessageButton()
                                        .setCustomId('addboton')
                                        .setLabel('')
                                        .setEmoji('<:mais:1036519937818230794>')
                                        .setStyle("SECONDARY"),
                                )
                                .addComponents(
                                    new Discord.MessageButton()
                                        .setCustomId('removeboton')
                                        .setLabel('')
                                        .setEmoji('<:menos:1036519982521143366>')
                                        .setStyle("SECONDARY"),
                                );
                                              
                            const embedss = new Discord.MessageEmbed()
                        .setDescription(`\n\⛩️ | **Produto: **\`${eprod.nome}\`\n\n🛒 | **Quantidade: **\`${quantidade1}\`\n\n💳 **| Preço Atual: **\`R$${precoalt}\``)
                       .setTitle(`${dbB.get(`nomebot`)} | Sistema de Compras`)
                       .addField(`**🚀 | Cupom:**`, `Nenhum`)
                       .addField(`**📦 | Desconto:**`, `0.00%`)
                       .setColor(`${dbB.get(`cor`)}`)
                       .setThumbnail(`${dbB.get(`foto`)}`)
                       .setImage(`${dbB.get(`banner`)}`)
                     c.send({ embeds: [embedss], components: [row], content: ` `, fetchReply: true }).then(msg => {
                       const filter = i => i.user.id === interaction.user.id;
                       const collector = msg.createMessageComponentCollector({ filter });
                       collector.on("collect", interaction => {
                         interaction.deferUpdate()
                         if (interaction.customId === 'addcboton') {
                           interaction.channel.permissionOverwrites.edit(interaction.user.id, { SEND_MESSAGES: true });
                            msg.channel.send("❓ | Qual o cupom?").then(mensagem => {
                             const filter = m => m.author.id === interaction.user.id;
                             const collector = mensagem.channel.createMessageCollector({ filter, max: 1 });
                             collector.on("collect", cupom => {
                               if(`${cupom}` !== `${dbc.get(`${cupom}.idcupom`)}`) {
                                 cupom.delete()
                                 mensagem.edit("❌ | Isso não é um cupom!")
                                 interaction.channel.permissionOverwrites.edit(interaction.user.id, { SEND_MESSAGES: false });
                                 return;
                               }
                                 
                               var minalt = 
                               dbc.get(`${cupom}.minimo`);
                               var dscalt = dbc.get(`${cupom}.desconto`);
                               var qtdalt = dbc.get(`${cupom}.quantidade`);
                                 
                               precoalt = Number(precoalt) + Number(`1`);
                               minalt = Number(minalt) + Number(`1`);
                               if(precoalt < minalt) {
                                 cupom.delete()
                                 interaction.channel.permissionOverwrites.edit(interaction.user.id, { SEND_MESSAGES: false });
                                   mensagem.edit(`<a:errado1:1041645915175391292> | Você não atingiu o mínimo!`)
                                 return;
                               } else {
                              
                               precoalt = Number(precoalt) - Number(`1`);
                               minalt = Number(minalt) - Number(`1`);
                                   
                               if(`${dbc.get(`${cupom}.quantidade`)}` === "0") {
                                 cupom.delete()
                                 interaction.channel.permissionOverwrites.edit(interaction.user.id, { SEND_MESSAGES: false });
                                   mensagem.edit("<a:errado1:1041645915175391292> | Esse cupom saiu de estoque!")
                                 return;
                               }
                                              
                               if(`${cupom}` === `${dbc.get(`${cupom}.idcupom`)}`) {
                                 cupom.delete()
                                 mensagem.edit("<a:certo1:1041646017793245206> | Cupom adicionado")
                                  interaction.channel.permissionOverwrites.edit(interaction.user.id, { SEND_MESSAGES: false });
                                   var precinho = precoalt;
                                   var descontinho = "0."+dscalt;
                                   var cupomfinal = precinho * descontinho;
                                   precoalt = precinho - cupomfinal;
                                   qtdalt = qtdalt - 1;
                                   row.components[0].setDisabled(true)
                                   const embedss2 = new Discord.MessageEmbed()
                                   .setDescription(`\n\⛩️ | **Produto: **\`${eprod.nome}\`\n\n🛒 | **Quantidade: **\`${quantidade1}\`\n\n💳 **| Preço Atual: **\`R$${precoalt}\``)
                                     .setTitle(`${dbB.get(`nomebot`)} | Sistema de Compras`)
                                                            .addField(`**🚀 | Cupom:**`, `${dbc.get(`${cupom}.idcupom`)}`)
                                     .addField(`**📦 | Desconto:**`, `${dbc.get(`${cupom}.desconto`)}.00%`)
                                     .setColor(`${dbB.get(`cor`)}`)
                                     .setThumbnail(`${dbB.get(`foto`)}`)
                                     .setImage(`${dbB.get(`banner`)}`)
                                   msg.edit({ embeds: [embedss2], components: [row], content: `Tenha uma boa compra !`, fetchReply: true })
                                   dbc.set(`${cupom}.quantidade`, `${qtdalt}`)
                                 }
                               }
                              }) 
                            })
                          }
                                    
                                    if (interaction.customId === "addboton") {

                                        const embedadici = new Discord.MessageEmbed()
                                            .setDescription(`Você não pode adicionar um valor maior do que o estoque`)
                                            .setColor(`${dbB.get(`cor`)}`)
                                        if (quantidade1++ >= quantidade) {
                                            quantidade1--;

                                            interaction.channel.send({ embeds: [embedadici] })
                                            const embedss2 = new Discord.MessageEmbed()
                                            .setTitle(`${dbB.get(`nomebot`)} | Sistema de Compras`)

                                                .setDescription(`\n\⛩️ | **Produto: **\`${eprod.nome}\`\n\n🛒 | **Quantidade: **\`${quantidade1}\`\n\n💳 **| Preço Atual: **\`R$${precoalt}\``)
                       .addField(`**🚀 | Cupom:**`, `Nenhum`)
                       .addField(`**📦 | Desconto:**`, `0.00%`)
                                                .setColor(`${dbB.get(`cor`)}`)
                                                .setThumbnail(`${dbB.get(`foto`)}`)
                                     .setImage(`${dbB.get(`banner`)}`)
                                            msg.edit({ embeds: [embedss2] })
                                        } else {
                                            precoalt = Number(precoalt) + Number(eprod.preco);
                                            const embedss = new Discord.MessageEmbed()
                                            .setTitle(`${dbB.get(`nomebot`)} | Sistema de Compras`)

                                                .setDescription(`\n\⛩️ | **Produto: **\`${eprod.nome}\`\n\n🛒 | **Quantidade: **\`${quantidade1}\`\n\n💳 **| Preço Atual: **\`R$${precoalt}\``)
                       .addField(`**🚀 | Cupom:**`, `Nenhum`)
                       .addField(`**📦 | Desconto:**`, `0.00%`)
                                                .setColor(`${dbB.get(`cor`)}`)
                                                .setThumbnail(`${dbB.get(`foto`)}`)
                                     .setImage(`${dbB.get(`banner`)}`)
                                            msg.edit({ embeds: [embedss] })
                                        }
                                    }
                                    if (interaction.customId === "removeboton") {
                                        if (quantidade1 <= 1) {
                                            const embedadici = new Discord.MessageEmbed()
                                                .setDescription(`Você não pode remover mais produtos`)
                                                .setColor(`${dbB.get(`cor`)}`)

                                            interaction.channel.send({ embeds: [embedadici] })

                                        } else {
                                            precoalt = precoalt - eprod.preco;
                                            quantidade1--;
                                            const embedss = new Discord.MessageEmbed()
                                                .setTitle(`Sistema de Compras`)

                        .setDescription(`\`\`\`${db.get(`${interaction.customId}.desc`)}\`\`\`\n\⛩️** | Produto: **\`${eprod.nome}\`\n\n**🛒 | Quantidade: **\`${quantidade1}\`\n\n💳 **| Preço Atual: **\`R$${precoalt}\`\n\n**✨ | Id da compra** \`${interaction.user.id}\``)
                       .addField(`**🚀 | Cupom:**`, `Nenhum`)
                       .addField(`**📦 | Desconto:**`, `0.00%`)
                                                .setColor(`${dbB.get(`cor`)}`)
                                            msg.edit({ embeds: [embedss] })
                                        }
                                    }
                                    if (interaction.customId === "comprarboton") {
                                        clearInterval(timer2)
msg.channel.bulkDelete(50);
                                        mercadopago.configurations.setAccessToken(`${dbB.get(`acesstoken`)}`);
                                        var payment_data = {
                                            transaction_amount: Number(precoalt),
                                            description: `Pagamento - ${interaction2.user.username}`,
                                            payment_method_id: 'pix',
                                            payer: {
                                                email: 'sixshop2022@gmail.com',
                                                first_name: 'Vision',
                                                last_name: 'Lisboa',
                                                identification: {
                                                    type: 'CPF',
                                                    number: '07944777984'
                                                },
                                                address: {
                                                    zip_code: '06233200',
                                                    street_name: 'Av. das Nações Unidas',
                                                    street_number: '3003',
                                                    neighborhood: 'Bonfim',
                                                    city: 'Osasco',
                                                    federal_unit: 'SP'
                                                }
                                            }
                                        };
        
                                        mercadopago.payment.create(payment_data).then(function (data) {
                                            const buffer = Buffer.from(data.body.point_of_interaction.transaction_data.qr_code_base64, "base64");
                                            const attachment = new Discord.MessageAttachment(buffer, "payment.png");
                                            const row = new Discord.MessageActionRow()
                                            .addComponents(
                                                new Discord.MessageButton()
                                                    .setCustomId('qrcode')
                                                    .setEmoji('<:emojiqrcode:1038576847295881246>')
                                                    .setLabel("QR Code")
                                                    .setDisabled(true)
                                                    .setStyle("PRIMARY"),
                                            )
                                                .addComponents(
                                                    new Discord.MessageButton()
                                                        .setCustomId('codigo')
                                                        .setEmoji('<:ticketlog:1036240546785665124>')
                                                        .setLabel("Pix Copia e Cola")
                                                        .setStyle("PRIMARY"),
                                                )
                                                .addComponents(
                                                    new Discord.MessageButton()
                                                        .setCustomId('cancelarpix')
                                                        .setEmoji('<a:errado1:1014994101747339314>')
                                                        .setLabel("Cancelar")
                                                        .setStyle("DANGER"),
                                                );
                                            const embed = new Discord.MessageEmbed()
                                                .setTitle(`${dbB.get(`nomebot`)} | Sistema de pagamento`)
                                                .setDescription(`\`\`\`Pague para finalizar a compra \`\`\`\n\⛩️ | **Produto: **\`${eprod.nome}\`\n\n🛒 | **Quantidade: **\`${quantidade1}\`\n\n💳 **| Preço: **\`R$${precoalt}\`\n\n**✨ | ID da compra** \`${data.body.id}\``)
                                                .setImage("attachment://payment.png")
                                                .setColor(`${dbB.get(`cor`)}`)
                                                .setFooter("Após efetuar o pagamento, o tempo de entrega é de no maximo 30 segundos!")
                                            msg.channel.send({ embeds: [embed], files: [attachment], components: [row] }).then(msg => {

                                                const collector = msg.channel.createMessageComponentCollector();
                                                const lopp = setInterval(function () {
                                                    const time2 = setTimeout(function () {
                                                        clearInterval(lopp);
                                                        msg.channel.delete()
                                                    }, 300000)
                                                    axios.get(`https://api.mercadolibre.com/collections/notifications/${data.body.id}`, {
                                                        headers: {
                                                            'Authorization': `Bearer ${dbB.get(`acesstoken`)}`
                                                        }
                                                    }).then(async (doc) => {

                                                        if (doc.data.collection.status === "approved") {
                                                            clearTimeout(time2)
                                                            clearInterval(lopp);
                                                            msg.channel.bulkDelete(50);
                                                            const a = db.get(`${severi}.conta`);
                                                            const embederror = new Discord.MessageEmbed()
                                                                .setTitle(`${dbB.get(`nomebot`)} | <a:giveway:1046087630028292156> Compra aprovada \nVerifique sua dm !`)
                                                                .setThumbnail(`${dbB.get(`foto`)}`)
                                                                .setImage(`${dbB.get(`banner`)}`)
                                                                .setDescription(`\`\`\`Infelizmente alguem comprou esse produto antes de você, mande mensagem para algum dos staffs e apresente o codigo: [${data.body.id}]\`\`\``)
                                                                .setColor(`${dbB.get(`cor`)}`)

                                                                db2.add("pedidostotal", 1)
                                                                db2.add("gastostotal", Number(precoalt))
                                                                
                                                                db2.add(`${moment().format('L')}.pedidos`, 1)
                                                                db2.add(`${moment().format('L')}.recebimentos`, Number(precoalt))
                                                                
                                                                db2.add(`${interaction.user.id}.gastosaprovados`, Number(precoalt))
                                                                db2.add(`${interaction.user.id}.pedidosaprovados`, 1)

                                                            if (a < quantidade1) {
                                                                interaction2.channel.send({ embeds: [embederror] })
                                                                client.channels.cache.get(`${db.get(`logs`)}`).send(`Ocorreu um erro na compra do: <@${interaction.user.id}>, Valor da compra: ${precoalt}`)
                                                            } else {
                                                            const removed = a.splice(0, Number(quantidade1));
                                                            db.set(`${severi}.conta`, a);
                                                            const embedentrega = new Discord.MessageEmbed()
                                                            .setTitle("<a:giveway:1046087630028292156>| Nova compra aprovada!")
                                                            .setDescription(`**<:Carrinho_WJ:1046088300290658394> | Produto:** \n\n\  \`\`\` 1º| ${removed.join("\n")}\`\`\`\n**✨ | Id da Compra:** ${data.body.id}\n\n**Avalie a nossa loja, por favor!** `)
                                                            .setColor(`${dbB.get(`cor`)}`)
                                                            .setThumbnail(`${dbB.get(`foto`)}`)
                                                            .setImage(`${dbB.get(`banner`)}`)
                                                            .setFooter("Muito obrigado pela sua compra !")
                                                            interaction.user.send({embeds: [embedentrega]})
                                                            const membro = interaction.guild.members.cache.get(interaction.user.id)
                                                            const role = interaction.guild.roles.cache.find(role => role.id === `${dbB.get(`cargo`)}`)
                                                            membro.roles.add(role)
                                                            setTimeout(() => interaction2.channel.delete(), 300000)
                                                            msg.channel.send("<a:giveway:1046087630028292156> | Pagamento Aprovado verifique a sua DM")
                                                            msg.channel.send(`<:info:1041639818918105119> | ID da sua compra || ${data.body.id} || `)
                                                            const embedcompraaprovada = new Discord.MessageEmbed()
                                                                .setTitle(`${dbB.get(`nomebot`)} | Compra aprovada`)
                                                                
                                  .setThumbnail(msg.guild.iconURL({dynamyc: true}))
                                                                .setDescription(`<a:giveway:1046087630028292156>**Nova compra aprovada!** <a:giveway:1046087630028292156>`)
                                                                .addField(`<:unknown1:1046089100442218516>| **COMPRADOR:**`, `${interaction.user.tag}`, true)
                                                                .addField(`<:IDD:1046088922238816296> | **ID COMPRADOR:**`, `\`${interaction.user.id}\``, true)
                                                                .addField(`<:unknown2:1046090675646627905> | **DATA:**`, `\`${moment().format('LLLL')}\``)
                                                                .addField(`<a:diam:1046089375102017626> | **PRODUTO:**`, `\`${eprod.nome}\``, true)
                                                                .addField(`<:DinheiroPS:1046086385716695061> | **VALOR PAGO:**`, `\`R$${precoalt}\``, true)
                                                                .addField(`<:caixa:1046085936674504755> | **QUANTIDADE COMPRADO:**`, `\`${quantidade1}\``)
                                                                .addField(`<:ticketlog:1046089466625937509> | **ID DA COMPRA**:`, `\`${data.body.id}\``)
                                                               .setColor(`${dbB.get(`cor`)}`)
                                                               .setFooter(`${dbB.get(`nomebot`)} | Todos os Direitos Reservados`)
                                                               .setThumbnail(`${dbB.get(`foto`)}`)
                                                            client.channels.cache.get(`${dbB.get(`logs`)}`).send({ embeds: [embedcompraaprovada] })



                                                            const embedaprovadolog = new Discord.MessageEmbed()
                                                            .setColor(`${dbB.get(`cor`)}`)
                                                            .setThumbnail(`${dbB.get(`foto`)}`)
                                                            .setImage(`${dbB.get(`banner`)}`)
                                                            client.channels.cache.get(config.logpublica).send({embeds: [embedaprovadolog]})


                                                            const row2 = new Discord.MessageActionRow()
                                                                .addComponents(
                                                                    new Discord.MessageButton()
                                                                        .setCustomId(interaction.customId)
                                                                        .setLabel('COMPRAR')
                                                                        .setEmoji('<:Compra:1024351817133473924>')
                                                                        .setStyle('SUCCESS'),
                                                                );
                                                            const embed2 = new Discord.MessageEmbed()
                                                                .setTitle(`${dbB.get(`nomebot`)} | Produto`)
                                                                .setDescription(`\`\`\`${db.get(`${interaction.customId}.desc`)}\`\`\`\n<a:planeta:1046086073941508206> | **Nome:** **__${db.get(`${interaction.customId}.nome`)}__**\n<:DinheiroPS:1046086385716695061> - **Preço:** **__R$${db.get(`${interaction.customId}.preco`)}__**\n<:caixa:1046085936674504755> - **Estoque:** **__${db.get(`${interaction.customId}.conta`).length}__**`)
                                                                .setColor(`${dbB.get(`cor`)}`)
                                                                .setFooter("Para comprar clique no botão abaixo.")
                                                                .setThumbnail(`${dbB.get(`foto`)}`)
                                                                .setImage(`${dbB.get(`banner`)}`)
                                                            interaction.message.edit({ embeds: [embed2], components: [row2] })
                                                        }}
                                                    })
                                                }, 10000)
                                                collector.on("collect", interaction => {
                                                    if (interaction.customId === 'codigo') {
                                                        interaction.deferUpdate();
                                                        const row = new Discord.MessageActionRow()
                                                        
                                                    
                                                        .addComponents(
                                                            new Discord.MessageButton()
                                                                .setCustomId('cancelarpix')
                                                                .setEmoji('<a:errado1:1014994101747339314>')
                                                                .setLabel("Cancelar")
                                                                .setStyle("DANGER"),
                                                        );
                                                        const embed = new Discord.MessageEmbed()
                                                            .setTitle(`${dbB.get(`nomebot`)} | Sistema de pagamento`)
                                                            .setDescription(`\`\`\`Pague para finalizar a compra \`\`\`\n\⛩️ | **Produto: **\`${eprod.nome}\`\n\n🛒 | **Quantidade: **\`${quantidade1}\`\n\n💳 **| Preço: **\`R$${precoalt}\`\n\n**✨ | ID da compra** \`${data.body.id}\``)
                                                            .setImage("attachment://payment.png")
                                                            .setColor(`${dbB.get(`cor`)}`)
                                                            .setFooter("Após efetuar o pagamento, o tempo de entrega é de no maximo 30 segundos!")
                                                        msg.edit({ embeds: [embed], files: [attachment], components: [row] })
                                                        interaction.channel.send(data.body.point_of_interaction.transaction_data.qr_code)
                                                    }
                                                    if (interaction.customId === 'cancelarpix') {
                                                        clearInterval(lopp);
                                                        interaction.channel.delete()
                                                    }
                                                })
                                            })
                                        }).catch(function (error) {
                                            console.log(error)
                                        });





                                    }
                                })
                            })
                        }
                        if (interaction2.customId == 'cancelar') {
                            clearInterval(timer1);
                            interaction2.channel.delete();
                        }
                    })
                })
            })
        }



    }
})
  