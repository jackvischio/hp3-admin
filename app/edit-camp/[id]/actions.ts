'use server';

import { db } from '@/app/db';
import { campionato } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function updateRecord(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  const nome = formData.get('nome') as string;
  const nome_fisr = formData.get('nome_fisr') as string;
  const fk_tipo_camp = parseInt(formData.get('fk_tipo_camp') as string);
  const fk_league = parseInt(formData.get('fk_league') as string);
  const fk_stagione = parseInt(formData.get('fk_stagione') as string);
  const configRaw = formData.get('config') as string;

  let config = null;
  try {
    config = JSON.parse(configRaw);
  } catch (e) {
    throw new Error("Config JSON malformato");
  }

  console.log(formData)

//   await db.update(campionato).set({
//     nome,
//     nomeFisr: nome_fisr,
//     fkTipoCamp: fk_tipo_camp,
//     // fk_tipo_camp,
//     // fk_league,
//     // fk_stagione,
//     // config,
//   }).where(eq(campionato.id, id));

  //redirect('/edit-record'); // Redirect dopo salvataggio
}