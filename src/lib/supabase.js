import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fungsi untuk memastikan kolom role ada di tabel profiles dan super admin terdaftar
export const ensureRoleColumn = async () => {
  try {
    console.log('Checking for super admin in database...');
    // Cek apakah super admin sudah ada di database
    const { data: superAdminExists, error: superAdminError } = await supabase
      .from('admin')
      .select('email')
      .eq('email', 'rifki10rpl1.2019@gmail.com')
      .single();
    
    console.log('Super admin check result:', superAdminExists, superAdminError);
    
    // Jika super admin belum ada, tambahkan
    if (superAdminError) {
      console.log('Super admin not found, adding...');
      const { data: insertData, error: insertError } = await supabase
        .from('admin')
        .insert({
          username: 'rifkihariyanto',
          email: 'rifki10rpl1.2019@gmail.com',
          password: 'superadmin-password'
        })
        .select();
      
      if (!insertError) {
        console.log('Super admin added successfully:', insertData);
      } else {
        console.error('Error adding super admin:', insertError);
      }
    } else {
      console.log('Super admin already exists');
    }
    
    // Cek apakah admin sudah ada di database
    const { data: adminExists, error: adminError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', 'sagayac697@elobits.com')
      .single();
    
    if (!adminError && adminExists) {
      // Update admin role
      await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('email', 'sagayac697@elobits.com');
      
      console.log('Admin role updated successfully');
    }
    
    // Update semua user yang belum memiliki role
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'user' })
      .is('role', null);
    
    if (!updateError) {
      console.log('Default roles set for users');
    }
  } catch (error) {
    console.error('Error setting roles:', error);
  }
};

// Panggil fungsi ensureRoleColumn saat aplikasi dimulai
if (typeof window !== 'undefined') {
  ensureRoleColumn();
}

export default supabase;