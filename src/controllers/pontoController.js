const db = require('../config/db'); // conexão com MariaDB
const moment = require('moment');

exports.registrarPonto = async (req, res) => {
  const { funcionario_id, turno } = req.body;
  const agora = moment();
  const dataHoje = agora.format('YYYY-MM-DD');
  const horaAtual = agora.format('HH:mm:ss');

  try {
    // Verifica se já existe registro para hoje
    const [registro] = await db.query(
      'SELECT * FROM ponto WHERE funcionario_id = ? AND data = ?',
      [funcionario_id, dataHoje]
    );

    if (!registro.length) {
      // Cria novo registro
      const campos = turno === 'manha'
        ? { entrada_manha: horaAtual }
        : { entrada_tarde: horaAtual };

      await db.query(
        'INSERT INTO ponto (funcionario_id, data, ??) VALUES (?, ?, ?)',
        [Object.keys(campos)[0], funcionario_id, dataHoje, horaAtual]
      );
    } else {
      // Atualiza registro existente
      const campo = registro[0][`${turno === 'manha' ? 'saida_manha' : 'saida_tarde'}`]
        ? `${turno === 'manha' ? 'entrada_manha' : 'entrada_tarde'}`
        : `${turno === 'manha' ? 'saida_manha' : 'saida_tarde'}`;

      await db.query(
        `UPDATE ponto SET ${campo} = ? WHERE funcionario_id = ? AND data = ?`,
        [horaAtual, funcionario_id, dataHoje]
      );
    }

    res.status(200).json({ mensagem: 'Ponto registrado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao registrar ponto.' });
  }
};
