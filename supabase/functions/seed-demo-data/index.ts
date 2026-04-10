import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const demoData = [
      {
        email: 'dr.sarah.chen@example.com',
        password: 'DemoPassword123!',
        name: 'Dr. Sarah Chen',
        role: 'DOCTOR',
        specialty: 'Cardiology',
        hospital: 'Metropolitan Heart Hospital',
        country: 'United States',
        bio: 'Board-certified cardiologist with 12 years of experience in diagnosing and treating cardiovascular conditions.',
        rating: 5.0,
        casesClosed: 47,
        walletBalance: 2500.00,
      },
      {
        email: 'dr.james.wilson@example.com',
        password: 'DemoPassword123!',
        name: 'Dr. James Wilson',
        role: 'DOCTOR',
        specialty: 'Neurology',
        hospital: 'Neuroscience Research Center',
        country: 'United States',
        bio: 'Specialist in neurological disorders with expertise in migraine management and neurological diagnostics.',
        rating: 4.8,
        casesClosed: 38,
        walletBalance: 1800.00,
      },
      {
        email: 'dr.priya.patel@example.com',
        password: 'DemoPassword123!',
        name: 'Dr. Priya Patel',
        role: 'DOCTOR',
        specialty: 'Dermatology',
        hospital: 'Skin Health Clinic',
        country: 'Canada',
        bio: 'Expert dermatologist with 10 years of experience in treating various skin conditions and dermatological disorders.',
        rating: 4.9,
        casesClosed: 42,
        walletBalance: 2100.00,
      },
      {
        email: 'john.anderson@example.com',
        password: 'DemoPassword123!',
        name: 'John Anderson',
        role: 'PATIENT',
        walletBalance: 500.00,
      },
      {
        email: 'emily.rodriguez@example.com',
        password: 'DemoPassword123!',
        name: 'Emily Rodriguez',
        role: 'PATIENT',
        walletBalance: 750.00,
      },
      {
        email: 'michael.johnson@example.com',
        password: 'DemoPassword123!',
        name: 'Michael Johnson',
        role: 'PATIENT',
        walletBalance: 600.00,
      },
    ];

    const createdUsers: any = [];

    // Create auth users and user records
    for (const userData of demoData) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', userData.email)
        .maybeSingle();

      if (existingUser) {
        createdUsers.push({
          email: userData.email,
          status: 'already_exists',
        });
        continue;
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
      });

      if (authError) {
        createdUsers.push({
          email: userData.email,
          status: 'failed',
          error: authError.message,
        });
        continue;
      }

      // Create user record
      const isDoctor = userData.role === 'DOCTOR';
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          is_approved: true,
          specialty: isDoctor ? userData.specialty : null,
          hospital: isDoctor ? userData.hospital : null,
          country: isDoctor ? userData.country : null,
          bio: isDoctor ? userData.bio : null,
          rating: isDoctor ? userData.rating : 5.0,
          cases_closed: isDoctor ? userData.casesClosed : 0,
          wallet_balance: userData.walletBalance,
        })
        .select()
        .single();

      if (userError) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        createdUsers.push({
          email: userData.email,
          status: 'failed',
          error: userError.message,
        });
        continue;
      }

      createdUsers.push({
        email: userData.email,
        id: authData.user.id,
        status: 'created',
      });
    }

    // Get IDs of created users
    const { data: allUsers } = await supabase
      .from('users')
      .select('id, email')
      .in(
        'email',
        [
          'dr.sarah.chen@example.com',
          'dr.james.wilson@example.com',
          'dr.priya.patel@example.com',
          'john.anderson@example.com',
          'emily.rodriguez@example.com',
          'michael.johnson@example.com',
        ]
      );

    const userMap = new Map(
      allUsers?.map((u: any) => [u.email, u.id]) || []
    );

    // Check if cases already exist
    const { data: existingCases } = await supabase
      .from('cases')
      .select('id')
      .in(
        'id',
        [
          'c0000000-0000-0000-0000-000000000001',
          'c0000000-0000-0000-0000-000000000002',
          'c0000000-0000-0000-0000-000000000003',
        ]
      );

    let casesCreated = false;

    if (!existingCases || existingCases.length === 0) {
      // Create cases
      const cases = [
        {
          id: 'c0000000-0000-0000-0000-000000000001',
          patient_id: userMap.get('john.anderson@example.com'),
          patient_name: 'John Anderson',
          specialty: 'Cardiology',
          status: 'In Progress',
          symptoms:
            'Chest pain when exercising, shortness of breath, dizziness. Patient reports symptoms started two weeks ago after increased physical activity. No prior history of cardiac issues.',
          assigned_doctor_id: userMap.get('dr.sarah.chen@example.com'),
          is_rare: false,
        },
        {
          id: 'c0000000-0000-0000-0000-000000000002',
          patient_id: userMap.get('emily.rodriguez@example.com'),
          patient_name: 'Emily Rodriguez',
          specialty: 'Neurology',
          status: 'In Progress',
          symptoms:
            'Frequent migraines lasting 4-6 hours, light sensitivity, nausea. Migraines occur 2-3 times per week. Triggered by stress and lack of sleep. Previous medications provided minimal relief.',
          assigned_doctor_id: userMap.get('dr.james.wilson@example.com'),
          is_rare: false,
        },
        {
          id: 'c0000000-0000-0000-0000-000000000003',
          patient_id: userMap.get('michael.johnson@example.com'),
          patient_name: 'Michael Johnson',
          specialty: 'Dermatology',
          status: 'Closed',
          symptoms:
            'Red itchy rash on forearms, appeared after camping trip. Rash is localized to exposed areas. Patient applied over-the-counter cream without improvement. Likely contact dermatitis.',
          assigned_doctor_id: userMap.get('dr.priya.patel@example.com'),
          is_rare: false,
        },
      ];

      const { error: casesError } = await supabase.from('cases').insert(cases);

      if (!casesError) {
        casesCreated = true;

        // Create transactions
        const transactions = [
          {
            id: 't0000000-0000-0000-0000-000000000001',
            user_id: userMap.get('john.anderson@example.com'),
            amount: 200.0,
            type: 'CASE_FEE',
            description: 'Case fee for cardiology consultation',
            case_id: 'c0000000-0000-0000-0000-000000000001',
          },
          {
            id: 't0000000-0000-0000-0000-000000000002',
            user_id: userMap.get('dr.sarah.chen@example.com'),
            amount: 150.0,
            type: 'PAYOUT',
            description: 'Payment for case analysis',
            case_id: 'c0000000-0000-0000-0000-000000000001',
          },
          {
            id: 't0000000-0000-0000-0000-000000000003',
            user_id: userMap.get('emily.rodriguez@example.com'),
            amount: 200.0,
            type: 'CASE_FEE',
            description: 'Case fee for neurology consultation',
            case_id: 'c0000000-0000-0000-0000-000000000002',
          },
          {
            id: 't0000000-0000-0000-0000-000000000004',
            user_id: userMap.get('dr.james.wilson@example.com'),
            amount: 150.0,
            type: 'PAYOUT',
            description: 'Payment for case analysis',
            case_id: 'c0000000-0000-0000-0000-000000000002',
          },
          {
            id: 't0000000-0000-0000-0000-000000000005',
            user_id: userMap.get('michael.johnson@example.com'),
            amount: 200.0,
            type: 'CASE_FEE',
            description: 'Case fee for dermatology consultation',
            case_id: 'c0000000-0000-0000-0000-000000000003',
          },
          {
            id: 't0000000-0000-0000-0000-000000000006',
            user_id: userMap.get('dr.priya.patel@example.com'),
            amount: 150.0,
            type: 'PAYOUT',
            description: 'Payment for case analysis',
            case_id: 'c0000000-0000-0000-0000-000000000003',
          },
        ];

        await supabase.from('transactions').insert(transactions);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        users: createdUsers,
        casesCreated,
        message: 'Demo data seeding completed',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
