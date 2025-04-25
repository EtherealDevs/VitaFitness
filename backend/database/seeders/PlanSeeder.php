<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Plan::create([
            'name' => 'Pilates',
            'description' => '
                Pilates es un método de entrenamiento físico y mental que se centra en el fortalecimiento del núcleo, la mejora de la flexibilidad y la alineación postural. Se basa en una serie de ejercicios controlados que se realizan en una colchoneta o utilizando equipos especializados, como el reformer. Pilates promueve la conexión mente-cuerpo y se adapta a diferentes niveles de condición física.',
            'status' => 'activo'
        ]);
        Plan::create([
            'name' => 'Local Power',
            'description' => '
                Local Power es un programa de entrenamiento que combina ejercicios de fuerza y resistencia para desarrollar la potencia muscular y mejorar el rendimiento físico. Se centra en movimientos funcionales y utiliza pesas, bandas de resistencia y el propio peso corporal para desafiar los músculos. Local Power es ideal para quienes buscan aumentar su fuerza y tonificar su cuerpo.',
            'status' => 'activo'
        ]);
        Plan::create([
            'name' => 'GAP',
            'description' => '
            ',
            'status' => 'activo'
        ]);
        Plan::create([
            'name' => 'Functional ',
            'description' => '
                El entrenamiento funcional es un enfoque de acondicionamiento físico que se centra en movimientos que imitan actividades cotidianas y deportivas. Utiliza ejercicios compuestos que involucran múltiples grupos musculares y patrones de movimiento funcionales. El objetivo es mejorar la fuerza, la estabilidad y la movilidad, lo que resulta en un mejor rendimiento en la vida diaria y en el deporte.',
            'status' => 'activo'
        ]);
        Plan::create([
            'name' => 'Fit Boxing',
            'description' => '
                El Fit Boxing es una forma de ejercicio que combina movimientos de boxeo con música y entrenamiento cardiovascular. Se centra en golpear sacos de boxeo o realizar combinaciones de golpes al aire, lo que ayuda a mejorar la resistencia, la coordinación y la fuerza. Es una actividad divertida y energizante que también puede ser una excelente manera de liberar el estrés.',
            'status' => 'activo'
        ]);
        Plan::create([
            'name' => 'Cycling',
            'description' => '
                El Cycling es una actividad de ejercicio cardiovascular que se realiza en bicicletas estacionarias. Las clases de cycling suelen ser en grupo y están dirigidas por un instructor que guía a los participantes a través de diferentes intensidades y ritmos. Es una forma efectiva de mejorar la resistencia cardiovascular, quemar calorías y tonificar las piernas.',
            'status' => 'activo'
        ]);
    }
}
