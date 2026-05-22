/**
 * Script de vérification de la connexion Supabase
 * À lancer avec: npx tsx lib/check-supabase.ts
 */
import { supabase } from './supabase';

async function checkSupabase() {
  console.log('🔍 Vérification de la connexion Supabase...\n');

  // 1. Vérifier que le client est bien initialisé
  if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Variables manquantes !');
    console.error('EXPO_PUBLIC_SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL || 'NON DÉFINI');
    console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'DÉFINI (caché)' : 'NON DÉFINI');
    return;
  }

  console.log('✅ Variables d\'environnement présentes');
  console.log('URL Supabase:', process.env.EXPO_PUBLIC_SUPABASE_URL);
  console.log('Clé ANON:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...\n');

  // 2. Tester la connexion
  try {
    const { data, error } = await supabase.from('commandes').select('id').limit(1);
    
    if (error) {
      console.error('❌ Erreur de connexion:', error.message);
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.error('\n💡 La table "commandes" n\'existe pas ou n\'est pas accessible.');
        console.error('Vérifie que :');
        console.error('  1. La table "commandes" existe dans ton projet Supabase');
        console.error('  2. L\'API anon key a les droits de lecture sur cette table');
      }
      return;
    }

    console.log('✅ Connexion réussie !');
    console.log('Nombre de lignes test:', data.length);
    console.log('\n🎉 Supabase est bien configuré !');

    // 3. Vérifier si la réplication est activée
    console.log('\n📡 Vérification du temps réel...');
    const channel = supabase
      .channel('test-replication')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'commandes',
        },
        (payload) => {
          console.log('🔔 Temps réel OK ! Payload:', payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Temps réel activé sur la table "commandes"');
          supabase.removeChannel(channel);
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Erreur d\'abonnement temps réel');
          console.error('💡 Vérifie que la réplication est activée sur la table "commandes" dans Supabase');
        }
      });

  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  }
}

checkSupabase();
